# a programming language but it's all corporate buzzword

**On this page:** [What that actually looks like](#what-that-actually-looks-like) · [Synergy](#synergy) · [Hello world, as meeting notes](#hello-world-as-meeting-notes)

Esoslangs are short for "esoteric programming languages", and they live on a wiki called [esolangs.org](https://esolangs.org/wiki/Esoteric_programming_language).

 Famous ones include [**brainfuck**](https://esolangs.org/wiki/Brainfuck), which has only 8 commands and looks like someone fell asleep on their keyboard, and [**Shakespeare**](https://esolangs.org/wiki/Shakespeare), where your program has to read like a Shakespeare play where variables are characters, and you give them stage directions. Anyone can write real and working programs in these.

## what that actually looks like

Here's a brainfuck program that prints "Hi":

```
++++++++[>+++++++++<-]>.+++++++++++++++++++++++++++++++++.
```

That's the whole program. It counts up to 72 (the number computers use for the letter H), prints it, counts up 33 more to 105 (the letter i), and prints that. Every symbol is a command: `+` adds one, `-` subtracts one, `>` and `<` move between memory slots, `[` and `]` loop, and `.` prints.

And here's the opening of a real Shakespeare program — the entire thing is a play, and it prints "Hello World!":

```
Romeo, a young man with a remarkable patience.
Juliet, a likewise young woman of remarkable grace.

Act I: Hamlet's insults and flattery.

Scene I: The insulting of Romeo.

[Enter Hamlet and Romeo]

Hamlet:
  You lying stupid fatherless big smelly half-witted coward!
```

The trick: every insult is secretly arithmetic. Positive adjectives count as +1, negative ones as −1, and nouns have hidden numeric values — so the dialogue adds up to the letter codes that spell out the message. The characters are the variables, the acts are the program's sections, and stage directions control the flow.

## Synergy

The only keywords are corporate buzzwords. Every program reads like a standup meeting:

- `move the needle` — add 1
- `take a step back` — subtract 1
- `pivot` — move right, `deep dive` — move left
- `share out` — print 
- `gather feedback` — read input
- `sync up` ... `circle back` — loop
- `hit a bottleneck` — stop the program (every corporate program ends at a bottleneck)
- `per my last email` — comment

It can compute anything any other language.

## hello world, as meeting notes

```
per my last email, here are the action items from standup

move the needle, move the needle, move the needle, move the needle,
move the needle, move the needle, move the needle, move the needle,
sync up, pivot, move the needle, move the needle, move the needle,
[... 100 more lines of this ...]
hit a bottleneck.
```

This prints `Hello World!`. A hundred lines of Synergy, and it says is hello.



Try it: 

there's a [playground on my creations page](/synergy.html) where you can write a standup and run it. The code is [on GitHub](https://github.com/mandyhoami-lab/synergy). If you want to read the interpreter it's one small file.
