// hand-written, not compiled from .ts
/* Synergy v2 — named counters, not a tape.
   Corporate buzzwords operating on named integer variables.
   Turing complete via two-counter (Minsky) machine. */

(function () {
  "use strict";

  var COMMANDS = [
    "hire",
    "layoff",
    "increase",
    "decrease",
    "set",
    "while",
    "circle back",
    "share out",
    "report",
    "gather feedback into",
    "per my last email",
    "hit a bottleneck"
  ];

  function tokenize(src) {
    var lines = src.split(/[\n;]+/);
    var tokens = [];
    lines.forEach(function (line) {
      var trimmed = line.trim().toLowerCase();
      if (!trimmed) return;
      if (trimmed.indexOf("per my last email") === 0) return; // whole line is a comment
      var parts = line.split(/[,.]+/);
      parts.forEach(function (part) {
        var p = part.trim().toLowerCase();
        if (!p) return;
        tokens.push(p);
      });
    });
    return tokens;
  }

  function parseToken(tok) {
    var m;
    if ((m = tok.match(/^hire\s+([a-z][a-z0-9]*)$/))) return { op: "hire", name: m[1] };
    if ((m = tok.match(/^move\s+the\s+needle\s+on\s+([a-z][a-z0-9]*)$/))) return { op: "hire", name: m[1] };
    if ((m = tok.match(/^layoff\s+([a-z][a-z0-9]*)$/))) return { op: "layoff", name: m[1] };
    if ((m = tok.match(/^increase\s+([a-z][a-z0-9]*)\s+by\s+(-?\d+)$/))) return { op: "increase", name: m[1], num: parseInt(m[2], 10) };
    if ((m = tok.match(/^decrease\s+([a-z][a-z0-9]*)\s+by\s+(-?\d+)$/))) return { op: "decrease", name: m[1], num: parseInt(m[2], 10) };
    if ((m = tok.match(/^set\s+([a-z][a-z0-9]*)\s+to\s+(-?\d+)$/))) return { op: "set", name: m[1], num: parseInt(m[2], 10) };
    if ((m = tok.match(/^while\s+([a-z][a-z0-9]*)\s+is\s+nonzero$/))) return { op: "while", name: m[1] };
    if (tok === "circle back") return { op: "circleback" };
    if ((m = tok.match(/^share\s+out\s+([a-z][a-z0-9]*)$/))) return { op: "shareout", name: m[1] };
    if ((m = tok.match(/^report\s+([a-z][a-z0-9]*)$/))) return { op: "report", name: m[1] };
    if ((m = tok.match(/^gather\s+feedback\s+into\s+([a-z][a-z0-9]*)$/))) return { op: "input", name: m[1] };
    if (tok === "hit a bottleneck") return { op: "halt" };
    return { op: "unknown", text: tok };
  }

  function createSession() {
    var vars = {};

    function get(name) { return vars[name] || 0; }
    function set(name, v) { vars[name] = v; }

    function buildJumpMap(tokens) {
      var map = {};
      var stack = [];
      tokens.forEach(function (t, i) {
        var p = parseToken(t);
        if (p.op === "while") stack.push(i);
        else if (p.op === "circleback") {
          if (stack.length === 0) throw new Error("circle back without while");
          var open = stack.pop();
          map[open] = i;
          map[i] = open;
        }
      });
      if (stack.length > 0) throw new Error("while without circle back");
      return map;
    }

    function exec(src, input) {
      var tokens = tokenize(src);
      var parsed = tokens.map(parseToken);
      parsed.forEach(function (p, i) {
        if (p.op === "unknown") throw new Error('I don\'t know "' + tokens[i] + '". Check the buzzwords key.');
      });
      var jumps = buildJumpMap(tokens);
      var out = "";
      var inputPos = 0;
      var pc = 0;
      var steps = 0;
      var STEP_LIMIT = 1000000;

      while (pc < parsed.length) {
        if (++steps > STEP_LIMIT) throw new Error("step limit hit. possible infinite loop.");
        var p = parsed[pc];
        switch (p.op) {
          case "hire": set(p.name, get(p.name) + 1); break;
          case "layoff": set(p.name, get(p.name) - 1); break;
          case "increase": set(p.name, get(p.name) + p.num); break;
          case "decrease": set(p.name, get(p.name) - p.num); break;
          case "set": set(p.name, p.num); break;
          case "while":
            if (get(p.name) === 0) pc = jumps[pc];
            break;
          case "circleback": {
            var whilePc = jumps[pc];
            var whileName = parseToken(tokens[whilePc]).name;
            if (get(whileName) !== 0) pc = whilePc;
            break;
          }
          case "shareout": {
            var v = get(p.name);
            v = ((v % 256) + 256) % 256;
            out += String.fromCharCode(v);
            break;
          }
          case "report": out += String(get(p.name)) + " "; break;
          case "input":
            if (input && inputPos < input.length) {
              set(p.name, input.charCodeAt(inputPos++));
            } else {
              set(p.name, 0);
            }
            break;
          case "halt": pc = parsed.length; continue;
        }
        pc++;
      }
      return out;
    }

    function state() {
      var copy = {};
      for (var k in vars) copy[k] = vars[k];
      return { vars: copy };
    }

    function reset() { vars = {}; }

    return { exec: exec, state: state, reset: reset, tokenize: tokenize };
  }

  function run(src, input) {
    var s = createSession();
    return s.exec(src, input);
  }

  function fromBrainfuck(bf) {
    var out = [];
    var cell = 0;
    for (var i = 0; i < bf.length; i++) {
      var c = bf[i];
      if (c === "+") out.push("hire c" + cell);
      else if (c === "-") out.push("layoff c" + cell);
      else if (c === ">") { cell++; }
      else if (c === "<") { cell--; }
      else if (c === ".") out.push("share out c" + cell);
      else if (c === ",") out.push("gather feedback into c" + cell);
      else if (c === "[") out.push("while c" + cell + " is nonzero");
      else if (c === "]") out.push("circle back");
    }
    return out.join(", ") + ".";
  }

  window.Synergy = {
    createSession: createSession,
    run: run,
    tokenize: tokenize,
    fromBrainfuck: fromBrainfuck,
    COMMANDS: COMMANDS
  };
})();
