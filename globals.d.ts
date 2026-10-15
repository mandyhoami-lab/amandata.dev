/* Global declarations for amandata.dev classic scripts.
   These describe values provided by other scripts or CDN <script> tags;
   this file emits no runtime code. */

/* Othello engine shared types (implemented in othello.ts,
   exposed as window.OthelloEngine for othello-advanced.ts). */
type OthelloCell = 'b' | 'w' | null;
type OthelloGrid = OthelloCell[][];
type OthelloPlayer = 'b' | 'w';
interface OthelloMove { r: number; c: number; flips: number[][]; }
interface OthelloEngineApi {
  newGrid(): OthelloGrid;
  legalMoves(g: OthelloGrid, p: OthelloPlayer): OthelloMove[];
  applyMove(g: OthelloGrid, mv: OthelloMove, p: OthelloPlayer): void;
  countDiscs(g: OthelloGrid): { b: number; w: number };
  evaluate(g: OthelloGrid, p: OthelloPlayer): number;
  aiChooseMove(g: OthelloGrid, moves: OthelloMove[], ai: OthelloPlayer, rnd?: () => number, blunder?: number): OthelloMove | null;
  other(p: OthelloPlayer): OthelloPlayer;
  searchMove(g: OthelloGrid, color: OthelloPlayer, depth: number): { mv: OthelloMove | null; score: number };
  gradeMove(g: OthelloGrid, mv: OthelloMove, color: OthelloPlayer, depth: number): { best: OthelloMove; diff: number; playedBest: boolean } | null;
  moveName(mv: OthelloMove): string;
  discSprite(color: string): string;
}

/* SITE_DATA (content-data.ts) — changelog + CV, rendered by content.ts. */
interface ChangelogEntry { d: string; h: string; }
interface CvStat { n: number; label: string; }
interface CvEntry { meta: string[]; role: string; lab: string; mentor: string; body: string[]; }
interface CvSkillCol { h: string; p: string; }
type CvBlock =
  | { title: string; kind: 'list'; items: string[] }
  | { title: string; kind: 'entries'; entries: CvEntry[] }
  | { title: string; kind: 'skills'; cols: CvSkillCol[] };
interface SiteData {
  changelog: ChangelogEntry[];
  cv: { stats: CvStat[]; blocks: CvBlock[] };
}

interface SupabaseConfig { SUPABASE_URL: string; SUPABASE_ANON_KEY: string; }

/* window.FLASHCARD_DECK — set by each deck page before flashcards.ts loads. */
interface FlashcardDeck {
  title: string; sub: string; backHref: string; backLabel: string;
  cards: { tag: string; term: string; def: string }[];
}

interface SiteLoadingApi { show: () => void; hide: () => void; }

interface Window {
  SITE_DATA: SiteData;
  ABOUT_BIO_HTML: string;
  SUPABASE_CONFIG: SupabaseConfig;
  OthelloEngine: OthelloEngineApi;
  othelloExInit: () => void;
  FLASHCARD_DECK?: FlashcardDeck;
  SiteLoading: SiteLoadingApi;
}

/* CDN globals (loaded via <script> tags in the HTML). */
declare const supabase: any;
declare const marked: any;
declare const DOMPurify: any;
/* node-test export shim used by othello.ts and othello-exercises.ts. */
declare var module: any;
