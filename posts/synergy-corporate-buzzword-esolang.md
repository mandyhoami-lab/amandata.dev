#  programming language but it's all corporate buzzword

**On this page:** [What are esoslangs](#post-title) · [Examples of esoslangs](#what-that-looks-like) · [Synergy: Corporate buzzword programing langauge](#synergy) · [How printing works](#how-printing-works) · [Print: hello world](#print-hello-world)

Esoslangs are short for "esoteric programming languages", and they live on a wiki called [esolangs.org](https://esolangs.org/wiki/Esoteric_programming_language). I like to imagine them as.. fully functioning satirical programming languages or coding art projects rather than any practical applications.

 Some famous ones include [**brainfuck**](https://esolangs.org/wiki/Brainfuck), which has only 8 commands and looks like someone fell asleep on their keyboard, and [**Shakespeare**](https://esolangs.org/wiki/Shakespeare), where your program has to read like a Shakespeare play where variables are characters, and you give them stage directions. And anyone can write real and working programs in these.

## what that looks like

The canonical brainfuck "Hello World!" from the [esolangs wiki](https://esolangs.org/wiki/Brainfuck):

```
++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.
```

That's the whole program. It sets up a few memory cells with a multiplication trick, then nudges each one up or down to the letter codes it needs, 72 for H, 101 for e, and so on, printing each with `.`. Every symbol is a command: `+` adds one, `-` subtracts one, `>` and `<` move between memory slots, `[` and `]` loop, and `.` prints.

Here's the opening of the Shakespeare "Hello World!" from the [esolangs wiki](https://esolangs.org/wiki/Shakespeare), a full program written as a play:

```
The Infamous Hello World Program.

Romeo, a young man with a remarkable patience.
Juliet, a likewise young woman of remarkable grace.

                    Act I: Hamlet's insults and flattery.

                    Scene I: The insulting of Romeo.

[Enter Hamlet and Romeo]

Hamlet:
 You lying stupid fatherless big smelly half-witted coward!
 You are as stupid as the difference between a handsome rich brave
 hero and thyself! Speak your mind!
```

The characters are the variables. A noun is worth 1 or -1 (a "hero" is 1, a "coward" is -1), and every adjective doubles it, so "a handsome rich brave hero" is 2³ = 8. The dialogue does arithmetic on the characters' values, and "Speak your mind!" prints the value as a letter.

## Synergy

I built Synergy because I wanted an esolang that reads like my calendar invites. The only keywords are corporate buzzwords. Everything reads like a progress meeting.

### v1: the tape

The first version mapped one-to-one onto [brainfuck](https://esolangs.org/wiki/Brainfuck): a tape of memory cells, a pointer, and buzzwords standing in for the 8 brainfuck commands.

- `move the needle`, add 1
- `take a step back`, subtract 1
- `pivot`, move right, `deep dive`, move left
- `share out`, print
- `gather feedback`, read input
- `sync up` ... `circle back`, loop
- `hit a bottleneck`, stop the program (every corporate program ends at a bottleneck)
- `per my last email`, comment

It worked, and it was funny, but the tape fits corporate speak poorly. It's one anonymous pointer moving through identical cells, and you add 5 by writing the increment five times. Standup language is good at names and quantities, which the tape can't use.

### v2: named counters

So v2 dropped the tape. Now Synergy runs on **named counters**: integer variables with names like `headcount` or `budget`. Two counters with increment, decrement, and a zero-test are already Turing complete (a Minsky machine), so nothing is lost, and programs read like an actual standup because the names carry meaning.

- `hire x`, add 1 to x
- `layoff x`, subtract 1 from x
- `increase x by 40`, add 40 (no more counting one by one)
- `decrease x by 40`, subtract 40
- `set x to 72`, set x directly
- `while x is nonzero` ... `circle back`, loop
- `share out x`, print x as a letter
- `report x`, print x as a number
- `gather feedback into x`, read input
- `hit a bottleneck`, stop

The v1 tape interpreter is preserved in git history.

### Synergy vs brainfuck

<div class="wiki-preview">
<p class="wiki-preview__tag">from the synergy wiki</p>
<table>
<tr><th></th><th>brainfuck</th><th>Synergy v2</th></tr>
<tr><td>Memory</td><td>Tape of cells, one pointer</td><td>Named counters, no pointer</td></tr>
<tr><td>Increment</td><td><code>+</code> (repeat N times)</td><td><code>hire x</code>, or <code>increase x by N</code></td></tr>
<tr><td>Loop</td><td><code>[</code> … <code>]</code></td><td><code>while x is nonzero</code> … <code>circle back</code></td></tr>
<tr><td>Set to N</td><td>n/a (must count up)</td><td><code>set x to N</code></td></tr>
</table>
<p><a href="/synergy-wiki.html">Read the full wiki &rarr;</a></p>
</div>

It can compute anything like any other language. The full command list lives on the [Synergy wiki](/synergy-wiki.html), every buzzword in plain language.

## how printing works

Numbers are also letters. 72 is H, 105 is i, 32 is a space, that's ASCII, the standard pretty much all computers use to turn numbers into text. So to print "Hi": `set h to 72`, `share out h` prints H. `set i to 105`, `share out i` prints i. The console's variable inspector shows the letter next to each number so you can watch it happen.

## print: hello world

```
per my last email, hello world

set h to 72, share out h,
set e to 101, share out e,
set l to 108, share out l, share out l,
set o to 111, share out o,
set space to 32, share out space,
set w to 87, share out w,
share out o, share out l,
set d to 100, share out d,
set bang to 33, share out bang.

hit a bottleneck.
```

This prints `Hello World!`. No counting up one by one, just set the number and share it out.



There's a [playground on my creations page](/synergy.html) where you can write a standup and run it. The code is [on GitHub](https://github.com/mandyhoami-lab/synergy). If you want to read the interpreter it's one small file.
