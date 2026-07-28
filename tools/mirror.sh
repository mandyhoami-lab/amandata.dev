#!/usr/bin/env bash
#
# Mirror the live amandata.dev into this repo.
#
# Fetches the deployed site, validates it really is the site (not a Cloudflare
# challenge or an error page), applies the sanitation steps below, and writes
# index.html plus every referenced asset into the repo root.
#
# The transformation is deterministic and idempotent: running it twice over the
# same upstream HTML produces byte-identical output. Do not hand-edit index.html
# or assets/ -- the next run overwrites them. Every change belongs in here.
#
# Sanitation applied:
#   1. Cloudflare email obfuscation -> plain mailto:. The hex payload is XOR'd
#      with a per-response random key, so it is decoded programmatically rather
#      than string-matched. Covers both the href form and __cf_email__ spans.
#   2. Drops the /cdn-cgi/ email-decode script, which 404s off Cloudflare.
#   3. Strips ?v=<hash> cache-busting from local asset refs, so a Carrd
#      republish with no content change produces an empty diff.
#
# Deliberately NOT done: the 39KB inline Carrd runtime is left intact. Excising
# it from minified generated JS is not reliably scriptable, and a rewrite is not
# a mirror.
#
# Usage: tools/mirror.sh [--check]
#   --check  fetch and sanitize, report whether output differs, write nothing

set -euo pipefail

SITE="https://amandata.dev"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

CHECK_ONLY=0
[ "${1:-}" = "--check" ] && CHECK_ONLY=1

log() { printf '%s\n' "$*" >&2; }
die() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

# --- fetch ----------------------------------------------------------------

log "==> fetching $SITE"
http_code="$(curl -sSL \
  --retry 3 --retry-delay 5 --retry-all-errors \
  --max-time 60 \
  -A 'amandata.dev-mirror/1.0 (+https://github.com/mandyhoami-lab/amandata.dev)' \
  -w '%{http_code}' \
  -o "$WORK/raw.html" \
  "$SITE")"

# --- validate: refuse to commit garbage over a good mirror ----------------

[ "$http_code" = "200" ] || die "expected HTTP 200, got $http_code"

size="$(wc -c < "$WORK/raw.html" | tr -d '[:space:]')"
[ "$size" -ge 50000 ] || die "response is only ${size}B (<50KB) -- likely a challenge or error page"

# Markers that identify this as the real site. Deliberately only stable ones --
# section anchors like #biography are renameable from the site editor, and using
# one here would hard-fail the mirror the day it changed. The builder signature
# also guards the self-mirror case: if the domain is ever repointed at this
# repo, a fetch lacking it means the source changed and a blind overwrite would
# be wrong. It is checked against the raw fetch, before sanitation removes it.
for marker in 'Amanda Ta' "indexedDB.open('carrd')"; do
  grep -qF "$marker" "$WORK/raw.html" \
    || die "expected marker not found: $marker -- refusing to overwrite the mirror"
done
log "    ok: ${size}B, all markers present"

# --- sanitize -------------------------------------------------------------

log "==> sanitizing"
perl -0777 -pe '
  # 1a. Cloudflare-obfuscated email href -> mailto:. First hex byte is the XOR
  #     key for the rest; the key is re-rolled per response.
  s{
    href="/cdn-cgi/l/email-protection\#([0-9a-fA-F]+)"
  }{
    my @b = map { hex } ($1 =~ /(..)/g);
    my $k = shift @b;
    q{href="mailto:} . join("", map { chr($_ ^ $k) } @b) . q{"}
  }gex;

  # 1b. Same encoding, span form. Appears if a visible address is ever added.
  s{
    <span[^>]*class="__cf_email__"[^>]*data-cfemail="([0-9a-fA-F]+)"[^>]*>.*?</span>
  }{
    my @b = map { hex } ($1 =~ /(..)/g);
    my $k = shift @b;
    join("", map { chr($_ ^ $k) } @b)
  }gexs;

  # 2. Drop the Cloudflare email-decode script (404s off Cloudflare).
  s{<script[^>]*/cdn-cgi/scripts/[^>]*></script>}{}g;

  # 3. Strip ?v=<hash> cache-busting from asset refs, relative and same-origin
  #    absolute (og:image uses the latter). Carrd re-rolls the hash on every
  #    republish, so leaving it in means a content-free diff each time. The
  #    Google Fonts query string is untouched -- that is a real API parameter.
  s{(["'"'"'(])((?:\./)?assets/[^"'"'"')?]+)\?v=[0-9a-f]+}{$1$2}g;
  s{(https?://amandata\.dev/assets/[^"'"'"')?]+)\?v=[0-9a-f]+}{$1}g;

  # 4. The only literal builder string in the output: an IndexedDB store name.
  #    Renaming is safe (the store is created and read by this same inline
  #    script, nothing external references it) and idempotent, since after the
  #    rename the pattern no longer matches.
  s{indexedDB\.open\('"'"'carrd'"'"'\)}{indexedDB.open('"'"'site'"'"')}g;
' "$WORK/raw.html" > "$WORK/index.html"

# Fail loudly rather than shipping a half-sanitized page.
if grep -q 'cdn-cgi' "$WORK/index.html"; then
  die "cdn-cgi references survived sanitation"
fi

# --- enumerate and fetch assets ------------------------------------------

# Covers src=/href=, CSS url(...), and data-src/srcset, so a newly added image
# is picked up automatically instead of needing this script edited. Same-origin
# absolute URLs are normalized to relative first -- og:image uses the absolute
# form, and it would otherwise be missed.
sed "s|https\?://amandata\.dev/|/|g" "$WORK/index.html" \
  | grep -oE '(src|href|data-src|srcset|poster|content)="[^"]*"|url\((['"'"'"]?)[^)]*\2\)' \
  | grep -oE '(\./|/)?assets/[A-Za-z0-9._/-]+' \
  | sed 's|^\./||; s|^/||' \
  | sort -u > "$WORK/assets.txt"

asset_count="$(wc -l < "$WORK/assets.txt" | tr -d '[:space:]')"
[ "$asset_count" -ge 1 ] || die "no assets found -- markup shape changed unexpectedly"
log "==> $asset_count asset(s) referenced"

while IFS= read -r rel; do
  [ -n "$rel" ] || continue
  mkdir -p "$WORK/$(dirname "$rel")"
  code="$(curl -sSL --retry 3 --retry-delay 5 --max-time 60 \
    -w '%{http_code}' -o "$WORK/$rel" "$SITE/$rel")"
  [ "$code" = "200" ] || die "asset $rel returned HTTP $code"
  [ -s "$WORK/$rel" ] || die "asset $rel is empty"
  log "    ok: $rel ($(wc -c < "$WORK/$rel" | tr -d '[:space:]')B)"
done < "$WORK/assets.txt"

# --- verify every local ref resolves -------------------------------------

missing=0
while IFS= read -r rel; do
  [ -n "$rel" ] || continue
  [ -f "$WORK/$rel" ] || { log "MISSING: $rel"; missing=1; }
done < "$WORK/assets.txt"
[ "$missing" -eq 0 ] || die "some referenced assets were not retrieved"

# --- report / install -----------------------------------------------------

if [ "$CHECK_ONLY" -eq 1 ]; then
  if diff -q "$WORK/index.html" "$REPO_ROOT/index.html" >/dev/null 2>&1; then
    log "==> no change"
  else
    log "==> index.html WOULD CHANGE"
  fi
  exit 0
fi

cp "$WORK/index.html" "$REPO_ROOT/index.html"
while IFS= read -r rel; do
  [ -n "$rel" ] || continue
  mkdir -p "$REPO_ROOT/$(dirname "$rel")"
  cp "$WORK/$rel" "$REPO_ROOT/$rel"
done < "$WORK/assets.txt"

log "==> mirror updated"
