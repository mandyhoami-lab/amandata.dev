/* =========================================================
   synergy — an esoteric programming language where the only
   keywords are corporate buzzwords. Brainfuck-complete, so it
   can compute anything, but every program reads like a bad
   standup meeting.

   Commands:
     move the needle   increment the current cell
     take a step back  decrement the current cell
     pivot             move to the next cell
     deep dive         move to the previous cell
     share out         output the current cell as a character
     gather feedback   read one character of input into the cell
     sync up           loop while the current cell is nonzero
     circle back       end of loop
     hit a bottleneck  halt the program

   Comments: any line starting with "per my last email" is ignored.

   Works in node (module.exports) and the browser (window.Synergy).
   ========================================================= */
(function () {
  'use strict';

  var PHRASES = [
    ['hit a bottleneck', 'halt'],
    ['take a step back', 'dec'],
    ['move the needle', 'inc'],
    ['gather feedback', 'in'],
    ['circle back', 'loop_end'],
    ['share out', 'out'],
    ['deep dive', 'left'],
    ['sync up', 'loop_start'],
    ['pivot', 'right']
  ];

  function tokenize(src) {
    // strip comment lines ("per my last email ...")
    var lines = src.split('\n').filter(function (l) {
      return l.trim().toLowerCase().indexOf('per my last email') !== 0;
    });
    var s = lines.join('\n').toLowerCase();
    var tokens = [];
    var i = 0;
    while (i < s.length) {
      var matched = false;
      for (var p = 0; p < PHRASES.length; p++) {
        var phrase = PHRASES[p][0];
        if (s.indexOf(phrase, i) === i) {
          // must be followed by a separator (not a letter)
          var after = s[i + phrase.length] || '';
          if (!/[a-z]/.test(after)) {
            tokens.push(PHRASES[p][1]);
            i += phrase.length;
            matched = true;
            break;
          }
        }
      }
      i++;
    }
    return tokens;
  }

  function run(src, input) {
    input = input || '';
    var tokens = tokenize(src);
    // bracket matching
    var jump = {};
    var stack = [];
    for (var i = 0; i < tokens.length; i++) {
      if (tokens[i] === 'loop_start') stack.push(i);
      else if (tokens[i] === 'loop_end') {
        var open = stack.pop();
        jump[open] = i;
        jump[i] = open;
      }
    }
    var tape = [0], ptr = 0, out = '', inPtr = 0, pc = 0;
    var steps = 0, LIMIT = 10000000;
    function cell() { return tape[ptr] || 0; }
    function set(v) { tape[ptr] = ((v % 256) + 256) % 256; }
    while (pc < tokens.length && steps < LIMIT) {
      steps++;
      var t = tokens[pc];
      if (t === 'inc') set(cell() + 1);
      else if (t === 'dec') set(cell() - 1);
      else if (t === 'right') { ptr++; if (ptr >= tape.length) tape.push(0); }
      else if (t === 'left') { ptr = Math.max(0, ptr - 1); }
      else if (t === 'out') out += String.fromCharCode(cell());
      else if (t === 'in') { set(inPtr < input.length ? input.charCodeAt(inPtr++) : 0); }
      else if (t === 'loop_start') { if (cell() === 0) pc = jump[pc]; }
      else if (t === 'loop_end') { if (cell() !== 0) pc = jump[pc]; }
      else if (t === 'halt') break;
      pc++;
    }
    return out;
  }

  // compile brainfuck to corporate, for generating examples
  var BF_MAP = { '+': 'move the needle', '-': 'take a step back', '>': 'pivot',
                 '<': 'deep dive', '.': 'share out', ',': 'gather feedback',
                 '[': 'sync up', ']': 'circle back' };
  function fromBrainfuck(bf) {
    return bf.split('').filter(function (c) { return BF_MAP[c]; })
      .map(function (c) { return BF_MAP[c]; }).join('. ') + '.';
  }

  /* Stateful session for the console: tape + pointer persist across exec() calls. */
  function createSession() {
    var tape = [0], ptr = 0;
    function cell() { return tape[ptr] || 0; }
    function set(v) { tape[ptr] = ((v % 256) + 256) % 256; }
    function buildJump(tokens) {
      var jump = {}, stack = [];
      for (var i = 0; i < tokens.length; i++) {
        if (tokens[i] === 'loop_start') stack.push(i);
        else if (tokens[i] === 'loop_end') {
          var open = stack.pop();
          if (open === undefined) throw new Error("circle back without sync up");
          jump[open] = i;
          jump[i] = open;
        }
      }
      if (stack.length) throw new Error("sync up without circle back");
      return jump;
    }
    return {
      exec: function (src, input) {
        input = input || '';
        var tokens = tokenize(src);
        var jump = buildJump(tokens);
        var out = '', inPtr = 0, pc = 0;
        var steps = 0, LIMIT = 1000000;
        while (pc < tokens.length && steps < LIMIT) {
          steps++;
          var t = tokens[pc];
          if (t === 'inc') set(cell() + 1);
          else if (t === 'dec') set(cell() - 1);
          else if (t === 'right') { ptr++; if (ptr >= tape.length) tape.push(0); }
          else if (t === 'left') { ptr = Math.max(0, ptr - 1); }
          else if (t === 'out') out += String.fromCharCode(cell());
          else if (t === 'in') { set(inPtr < input.length ? input.charCodeAt(inPtr++) : 0); }
          else if (t === 'loop_start') { if (cell() === 0) pc = jump[pc]; }
          else if (t === 'loop_end') { if (cell() !== 0) pc = jump[pc]; }
          else if (t === 'halt') break;
          pc++;
        }
        return out;
      },
      /* snapshot of tape state for the debugger */
      state: function () {
        return { tape: tape.slice(), ptr: ptr };
      },
      reset: function () {
        tape.length = 0; tape.push(0); ptr = 0;
      }
    };
  }

  var API = { run: run, tokenize: tokenize, fromBrainfuck: fromBrainfuck, createSession: createSession };
  if (typeof window !== 'undefined') window.Synergy = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})();
