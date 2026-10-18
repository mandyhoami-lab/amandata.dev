#  programming language but it's all corporate buzzword

**On this page:** [What are esoslangs](#post-title) · [Examples of esoslangs](#what-that-looks-like) · [Synergy: Corporate buzzword programing langauge](#synergy) · [How printing works](#how-printing-works) · [Print: hello world](#print-hello-world)

Esoslangs are short for "esoteric programming languages", and they live on a wiki called [esolangs.org](https://esolangs.org/wiki/Esoteric_programming_language). I like to imagine them as.. fully functioning satirical programming languages or coding art projects rather than any practical applications.

 Some famous ones include [**brainfuck**](https://esolangs.org/wiki/Brainfuck), which has only 8 commands and looks like someone fell asleep on their keyboard, and [**Shakespeare**](https://esolangs.org/wiki/Shakespeare), where your program has to read like a Shakespeare play where variables are characters, and you give them stage directions. And anyone can write real and working programs in these.

## what that looks like

A brainfuck program that prints "Hi" would look like this"

```
++++++++[>+++++++++<-]>.+++++++++++++++++++++++++++++++++.
```

That's the whole program. 

It counts up to 72 (the number computers use for the letter H), prints it, counts up 33 more to 105 (the letter i), and prints that. Every symbol is a command: `+` adds one, `-` subtracts one, `>` and `<` move between memory slots, `[` and `]` loop, and `.` prints.

 Here's the opening of the Shakespeare program and it prints "Hello World!":

```
Romeo, a young man with a remarkable patience.
Juliet, a likewise young woman of remarkable grace.

Act I: Hamlet's insults and flattery.

Scene I: The insulting of Romeo.

[Enter Hamlet and Romeo]

Hamlet:
  You lying stupid fatherless big smelly half-witted coward!
```

Positive adjectives count as +1, negative ones as −1, and nouns have numeric values so the dialogue adds up to the letter codes that spell out the message. The characters are the variables, the acts are the program's sections, and the stage directions control the flow.

## Synergy

The only keywords are corporate buzzwords. Everything reads like a progress meeting.

- `move the needle` — add 1
- `take a step back` — subtract 1
- `pivot` — move right, `deep dive` — move left
- `share out` — print 
- `gather feedback` — read input
- `sync up` ... `circle back` — loop
- `hit a bottleneck` — stop the program (every corporate program ends at a bottleneck)
- `per my last email` — comment
- `low-hanging fruit` — set the cell to 0
- `double-click on that` — print the cell as a number
- `run it up the flagpole` — print the whole tape
- `herding cats` — randomize the cell
- `put a pin in it` / `pull the pin` — save / restore the tape

It can compute anything like any other language. The full command list lives on the [Synergy wiki](/synergy-wiki.html) — every buzzword in plain language.

## how printing works

Numbers are also letters. 72 is H, 105 is i, 32 is a space — that's just how computers do it. So to print "Hi": count the first cell up to 72, `share out` prints H. `pivot` to the next cell, count up to 105, `share out` prints i. The console's tape debugger shows the letter next to each number so you can watch it happen.

## print: hello world

This prints Hello World!. A hundred lines of Synergy and it says hello.

```
per my last email, here are the action items from standup

move the needle, move the needle, move the needle, move the needle,
move the needle, move the needle, move the needle, move the needle,
sync up, pivot, move the needle, move the needle, move the needle,
[... 100 more lines of this ...]
hit a bottleneck.
```

This prints `Hello World!`. A hundred lines of Synergy and it says is hello.



There's a [playground on my creations page](/synergy.html) where you can write a standup and run it. The code is [on GitHub](https://github.com/mandyhoami-lab/synergy). If you want to read the interpreter it's one small file.
