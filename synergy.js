"use strict";
/* Synergy console shell, vignette + main, injected so the .html file stays a thin shell. */
(function () {
    "use strict";
    var mount = document.getElementById("page-mount");
    if (!mount)
        return;
    mount.outerHTML = `<div class="vignette" aria-hidden="true"></div>

<main>

  <section class="section" id="synergy">
    <div class="section__head">
      <p class="section__tag">esolang</p>
      <h2 class="section__title">Synergy</h2>
      <p class="creations-intro">programming language made of office buzzwords.<br>
      every program reads like a standup meeting, and the computer runs it.</p>
    </div>
    <div class="section__body">
      <div class="syn-wrap">
        <p class="syn-hello">Hello, you can find the blogpost on this <a href="/blog.html?p=synergy-corporate-buzzword-esolang">here</a>.</p>
        <p class="syn-hello">You can find the full wiki on this language <a href="/synergy-wiki.html">here</a>.</p>
        <div class="syn-row">
          <button id="syn-howto-btn" type="button">how to use this console</button>
        </div>
        <div class="syn-howto" id="syn-howto" hidden>
          <p><b>1.</b> Type a buzzword (or a few, separated by commas) into the box and hit enter.</p>
          <p><b>2.</b> The console runs it right away and shows what changed, the tape debugger above always shows your cells, with the pointer highlighted.</p>
          <p><b>3.</b> Try <i>move the needle</i> three times, watch the first cell count up. Then <i>pivot</i> and watch the pointer move.</p>
          <p><b>4.</b> <i>share out</i> prints the current cell as a letter, numbers are also letters (72 is H, 105 is i). The debugger shows the letter next to the number.</p>
          <p><b>5.</b> Loops need <i>sync up</i> … <i>circle back</i> on the same line. The preset buttons run full programs if you want to see one in action.</p>
        </div>
        <p class="syn-explain">Type buzzwords below and hit enter, the console runs each line and shows you what changed.</p>
        <div class="syn-examples-wrap">
          <p class="syn-examples__label">example programs</p>
          <div class="syn-examples" id="syn-examples" role="group" aria-label="example programs"></div>
        </div>
        <div class="syn-debug" id="syn-debug" aria-label="tape inspector"></div>
        <p class="syn-examples__label">output</p>
        <div class="syn-console" id="syn-console" aria-live="polite"></div>
        <div class="syn-inputrow">
          <span class="syn-prompt" aria-hidden="true">&gt;</span>
          <input id="syn-input" type="text" spellcheck="false" autocomplete="off" aria-label="type synergy code">
        </div>
        <div class="syn-row">
          <button id="syn-reset" type="button">reset the meeting</button>
        </div>
        <div class="syn-cheat">
          <p class="syn-cheat__head">Buzzwords key</p>
          <p class="syn-cheat__intro">Synergy has a row of numbered cells called the tape. You always point at one cell, the debugger above shows you which.</p>
          <b>move the needle</b>, add 1 to the cell you're pointing at &middot;
          <b>take a step back</b>, subtract 1 from it<br>
          <b>pivot</b> / <b>deep dive</b>, point at the next / previous cell<br>
          <b>share out</b>, print the current cell as a letter &middot;
          <b>gather feedback</b>, read a typed letter into the current cell<br>
          <b>sync up</b> … <b>circle back</b>, repeat everything between until the current cell hits zero<br>
          <b>hit a bottleneck</b>, stop &middot;
          <b>per my last email</b>, a comment, the computer ignores the line<br>
          <b>low-hanging fruit</b>, set the cell to 0 &middot;
          <b>double-click on that</b>, print the cell as a number<br>
          <b>run it up the flagpole</b>, print the whole tape &middot;
          <b>herding cats</b>, randomize the cell<br>
          <b>put a pin in it</b> / <b>pull the pin</b>, save / restore the tape
        </div>
        <p class="games-note"><a href="/synergy-wiki.html">Synergy wiki &rarr;</a> &middot; <a href="/creations.html">&larr; Back to Creations</a></p>
      </div>
    </div>
  </section>

</main>`;
    var PRESETS = {};
    var FROGREAL_BF = "[-]+++++++++++++++++++++++++++++++++++++++++++++...................+++++++++++++..-------------..++++++++++++++++..----------------.+++++++++++++.------------......++++++++++++...-------------....-----------------------------------.+++++++++++++++++++++++++++++++++++...........+++++++++++++.------------.....++++++++++++..------------...++++++++++++....------------........++++++++++++....-------------..-----------------------------------.+++++++++++++++++++++++++++++++++++..++++++++++++++++....----------------.+++++++++++++.------------........................++++++++++++......-------------..-----------------------------------.+++++++++++++++++++++++++++++++++++++++++++++++++++.....----------------.+++++++++++++.------------.......................++++++++++++...-------------.......-----------------------------------.+++++++++++++++++++++++++++++++++++++++++++++++++++.----------------..+++++++++++++...------------..........++++++++++++..------------.........++++++++++++.....-------------........-----------------------------------.++++++++++++++++++++++++++++++++++++++++++++++++..------------..............++++++++++++.-------------.+++++++++++++.------------.......++++++++++++.-------------.............-----------------------------------.++++++++++++++++++++++++++++++++++++.................++++++++++++.-------------.++++++++++++++++...----------------....++++++++++++++++..----------------...........++++++++++++++++.---------------------------------------------------.++++++++++++++++++++++++++++++++++++.................++++++++++++.+++.------------------.........++++++++++++++++++.---..........-------------.-----------------------------------.++++++++++++++++++++++++++++++++++++..............++++++++++++..-------------.--..........++++++++++++++++++..----------------.+++++++++++++.........-------------.-----------------------------------.++++++++++++++++++++++++++++++++++++...........++++++++++++...-------------.++++++++++++++++.------------------..........++++++++++++++++++..----------------......+++++++++++++.....-------------.-----------------------------------.++++++++++++++++++++++++++++++++++++.........++++++++++++..-------------..++++++++++++++++.------------------...........++++++++++++++++++......----------------.--..++++++++++++++++++.----------------.....-----------------------------------.++++++++++++++++++++++++++++++++++++.......++++++++++++....-------------.++++++++++++++++.-------------------....+.......++++++++++++++++++........-------------------..+.++.....-----------------------------------.++++++++++++++++++++++++++++++++++++...++++++++++++......+++.------------------....-.+.....-.+.++++++++++++++++++......----------------.++++++++++++++++.------------------.++.--.-.+.++++++++++++++++++.----------------....-----------------------------------.++++++++++++++++++++++++++++++++++++++++++++++++.........---------------.--------.+++++++.+..-.+.....-.+.++++++++++++++++++......----------------.++++++++++++++++..----------------.++++++++++++++++.-------------------..+.++....-----------------------------------.++++++++++++++++++++++++++++++++++++++++++++++++.........+++.--------------------------..+++++++...+.......++++++++++++++++++......---.+++..----------------..---...+++++++++++++++++++.---.-------------..-----------------------------------.++++++++++++++++++++++++++++++++++++++++++++++++.....-------------.+++++++++++++..-------------.+++++++++++++.----------------.-------..+++++++.....+.-..+.++++++++++++++++++..------------------.++++++++++++++++++...----------------.++++++++++++++++..----------------..---...+.++...-----------------------------------.++++++++++++++++++++++++++++++++++++++++++++++++...-------------.+++++++++++++.-------------.+++++++++++++..-------------..--.--------.+++++++..+.-...-------...++++++++++++++++++++++++++.---.-------------.++++++++++++++++..----------------...++++++++++++++++..----------------.++++++++++++++++.------------------------.+++++..+.++...-----------------------------------.+++++++++++++++++++++++++++++++++++......+++++++++++++..+++.-------------------.+.-.....-------.++.+++++.+.++.+++++++++++++.------------.++++++++++++.....+++.------------------....--------..+++++++..+++.+++++++++++++.-------------.-----------------------------------.+++++++++++++++++++++++++++++++++++........--.-.+++++++++++++++++++.------------------.-.....+.++.+++++++++++++..------------....++++++++++++..-------------.----------..+++++++.+.++++++++++++++++++.-------------------.-----.+++++..+++++++++++++++++++.---..------------------------------------------------.++++++++++++++++++++++++++++++++++++++++++++++++.-------------......++++++++++++++++.-------------------..+++++++++++++++++++.-------------------.-----..++++++.++.++++++++++++++++.------------------..++.+++++++++++++.....-------------.+++++++++++++.---------------.--------.+++++++.+++++++++++++++++++...------------------.------..++++++.++.+.++++++++++++.------------------------------------------------.+++++++++++++++++++++++++++++++++++.......--.-.+.-..-----.+++++.+++++++++++++++++++..------------------....++++++++++++++++++..----------------.....---.+.++++++++++++++++++..------------------.++++++++++++++++++..-------------------.-----.++++++.++++++++++++++++++.---.------------.------------------------------------.+++++++++++++++++++++++++++++++++++..+++++++++++++.-------------..++++++++++++++++.------------------..++++++++++++++++++..------------------.-.-------.+++++++...+.-....+.++++++++++++++++++.----------------..+++++++++++++.-------------.++++++++++++++++.----------------.++++++++++++++++.-------------------.+.++++++++++++++++++.---.-------------.----------.+++++++.+++++++++++++++++++.---.------------.";
    function fmtProgram(phrases, comment) {
        var lines = [comment, ""];
        for (var i = 0; i < phrases.length; i += 5) {
            lines.push(phrases.slice(i, i + 5).join(", ") + ".");
        }
        lines.push("", "hit a bottleneck.");
        return lines.join("\n");
    }
    function bfPhrases(bf) {
        return window.Synergy.fromBrainfuck(bf).split(". ").filter(function (s) { return s.length > 0; });
    }
    var FROG_BF = "++++++++++++++++++++++++++++++++.......++++++++++++++.-..+.------------------------------------.++++++++++++++++++++++......++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.-------------.----------------.++++++++++++++++.-------------------------------------------------------------------------------.++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.------------------------------------------------------------------------------------------------------------------.++++++++++++++++++++++......++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.------------------------------------------------------------------.+++++++++++++++++++++++++++++++++++++.------------------------------------------------.---------------.++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.------------------------------------------------------------------------------------------------------------------.++++++++++++++++++++++.....+++++++++++++++..---------------...++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.------------------------------------------------------------.++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.----------------------------------------------------------------------------------.++++++++++++++++++++++....++++++++.++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.--------------------------------------------------------------------------------------------.....++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.--------------------------------------------------------------------------------------------.+++++++++.-------------------------------.++++++++++++++++++++++...+++++++++++++++.--------.+++++++++++++++++++++++++++++++++++++++++++++++++++++.+++.---------------------------------------------------------------...+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.------------------------------------------------.+++++++++++++++++++++++++++++++++++++++++++++++++.----.----------------------------------------------------------------------------------.++++++++++++++++++++++...++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.+++...------------------------------------------------------.++++++++++++++++++++.---------------------.+++++++++++++++++++++++++++++++++++++++++++++++++++++++...------------------------------------------------.";
    var CAT_BF = "++++++++++++++++++++++++++++++++..+++++++++++++++.+++++++++++++++++++++++++++++++++++++++++++++.+++.------------------------------------------------.+++++++++++++++++++++++++++++++++++++++++++++.----------------------------------------------------------------------------------.++++++++++++++++++++++.++++++++.--------.+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.-----------------------------------------------------------------.+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.-------------------------------------------------------------------------------.+++++++++.-------------------------------.++++++++++++++++++++++..++++++++++++++++++++++++++++++.------------------------------.++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.--------------------------------------------------------------.++++++++++++++++++++++++++++.";
    function getPreset(name) {
        if (PRESETS[name])
            return PRESETS[name];
        var phrases;
        var comment;
        if (name === "count") {
            var bf = "";
            for (var i = 0; i < 49; i++)
                bf += "+";
            bf += ".+.+.+.+.";
            phrases = bfPhrases(bf);
            comment = "per my last email, counting to five";
        }
        else if (name === "hello") {
            var helloBf = "++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.";
            phrases = bfPhrases(helloBf);
            comment = "per my last email, here are the action items from standup";
        }
        else if (name === "add") {
            phrases = bfPhrases("+++>++++<[>+<-]>");
            phrases.push("double-click on that");
            comment = "per my last email, adding 3 + 4";
        }
        else if (name === "multiply") {
            phrases = bfPhrases("+++[>++++<-]>");
            phrases.push("double-click on that");
            comment = "per my last email, multiplying 3 x 4";
        }
        else if (name === "alphabet") {
            var az = ">"; // cell1 = 65 ('A')
            for (var a = 0; a < 65; a++)
                az += "+";
            az += "<"; // back to cell0
            for (var b = 0; b < 26; b++)
                az += "+"; // cell0 = 26 counter
            az += "[>.+<-]"; // print cell1, inc, dec counter
            phrases = bfPhrases(az);
            comment = "per my last email, the alphabet";
        }
        else if (name === "countdown") {
            phrases = bfPhrases("+++++");
            phrases.push("sync up", "double-click on that", "take a step back", "circle back");
            comment = "per my last email, counting down from five";
        }
        else if (name === "frog") {
            phrases = bfPhrases(FROG_BF);
            comment = "per my last email, a frog";
        }
        else if (name === "cat") {
            phrases = bfPhrases(CAT_BF);
            comment = "per my last email, a cat";
        }
        else if (name === "frogreal") {
            phrases = bfPhrases(FROGREAL_BF);
            comment = "per my last email, the dithered frog";
        }
        else {
            var hiBf = "++++++++[>+++++++++<-]>.";
            for (var j = 0; j < 33; j++)
                hiBf += "+";
            hiBf += ".";
            phrases = bfPhrases(hiBf);
            comment = "per my last email, just saying hi";
        }
        var prog = fmtProgram(phrases, comment);
        PRESETS[name] = prog;
        return prog;
    }
    var EXAMPLES = [
        { id: "hi", label: "Say hi", desc: 'prints "Hi"' },
        { id: "count", label: "Count to 5", desc: "prints 12345" },
        { id: "hello", label: "Hello world", desc: "the classic, in Synergy" },
        { id: "add", label: "Add 3 + 4", desc: "prints 7" },
        { id: "multiply", label: "Multiply 3 × 4", desc: "prints 12" },
        { id: "alphabet", label: "Alphabet", desc: "prints A to Z" },
        { id: "countdown", label: "Countdown", desc: "prints 5 4 3 2 1" },
        { id: "frog", label: "Frog", desc: "ascii art frog" },
        { id: "cat", label: "Cat", desc: "text symbol cat" },
        { id: "frogreal", label: "Dithered frog", desc: "your frog, printed by synergy" }
    ];
    var session = window.Synergy.createSession();
    var con = document.getElementById("syn-console");
    var debug = document.getElementById("syn-debug");
    var input = document.getElementById("syn-input");
    var resetBtn = document.getElementById("syn-reset");
    var howtoBtn = document.getElementById("syn-howto-btn");
    var howto = document.getElementById("syn-howto");
    if (howtoBtn && howto) {
        howtoBtn.addEventListener("click", function () {
            howto.hidden = !howto.hidden;
        });
    }
    function esc(s) {
        return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    /* debug: visual grid of the tape */
    function renderDebug() {
        var st = session.state();
        var cells = [];
        var n = Math.max(st.tape.length, 6);
        for (var i = 0; i < n; i++) {
            var v = st.tape[i] || 0;
            var cls = i === st.ptr ? "syn-cell syn-cell--ptr" : "syn-cell";
            var ch = v >= 32 && v < 127 ? String.fromCharCode(v) : " ";
            var bar = Math.round((v / 255) * 100);
            cells.push('<div class="' + cls + '">' +
                '<span class="syn-cell__idx">' + i + "</span>" +
                '<span class="syn-cell__val">' + v + "</span>" +
                '<span class="syn-cell__char">' + ch + "</span>" +
                '<span class="syn-cell__bar"><i style="width:' + bar + '%"></i></span>' +
                "</div>");
        }
        debug.innerHTML = '<span class="syn-debug__label">tape</span><div class="syn-grid">' + cells.join("") + "</div>";
    }
    function logLine(html, cls) {
        var div = document.createElement("div");
        div.className = "syn-line" + (cls ? " " + cls : "");
        div.innerHTML = html;
        con.appendChild(div);
        con.scrollTop = con.scrollHeight;
    }
    function printable(out) {
        /* show control chars as codes so learners see what share out actually did,
           but preserve newlines/tabs so art prints correctly */
        return out.split("").map(function (c) {
            var code = c.charCodeAt(0);
            if (code === 10 || code === 13 || code === 9)
                return c;
            return code >= 32 && code < 127 ? c : "&#9000;" + code;
        }).join("");
    }
    function submit(src) {
        var line = src.trim();
        if (!line)
            return;
        logLine('<span class="syn-echo">&gt; ' + esc(line) + "</span>");
        try {
            var out = session.exec(line);
            if (out)
                logLine('<span class="syn-out">' + printable(esc(out)) + "</span>");
            var st = session.state();
            logLine('<span class="syn-state">cell[' + st.ptr + "] = " + (st.tape[st.ptr] || 0) + "</span>", "syn-line--dim");
        }
        catch (e) {
            var msg = e instanceof Error ? e.message : String(e);
            logLine('<span class="syn-err">that didn\u2019t run: ' + esc(msg) + "</span>");
            var hint = "";
            if (msg.indexOf("circle back without sync up") >= 0)
                hint = "every circle back needs a sync up before it.";
            else if (msg.indexOf("sync up without circle back") >= 0)
                hint = "every sync up needs a circle back after it.";
            else if (window.Synergy.tokenize(line).length === 0)
                hint = "that line had no buzzwords in it. check the key below.";
            if (hint)
                logLine('<span class="syn-hint">try this: ' + esc(hint) + "</span>");
        }
        renderDebug();
    }
    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            submit(input.value);
            input.value = "";
        }
    });
    resetBtn.addEventListener("click", function () {
        session.reset();
        con.innerHTML = "";
        renderDebug();
        logLine('<span class="syn-state">fresh meeting. tape cleared.</span>', "syn-line--dim");
    });
    var examplesEl = document.getElementById("syn-examples");
    function renderExamples() {
        examplesEl.innerHTML = "";
        EXAMPLES.forEach(function (ex) {
            var b = document.createElement("button");
            b.type = "button";
            b.className = "syn-example";
            b.innerHTML = "<b>" + ex.label + "</b><span>" + ex.desc + "</span>";
            b.addEventListener("click", function () {
                session.reset();
                con.innerHTML = "";
                submit(getPreset(ex.id));
            });
            examplesEl.appendChild(b);
        });
    }
    renderExamples();
    renderDebug();
    logLine('<span class="syn-state">welcome to the synergy console. type a buzzword and hit enter.</span>', "syn-line--dim");
})();
