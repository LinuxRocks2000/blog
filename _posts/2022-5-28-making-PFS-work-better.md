---
title: "Making PFS work better"
bottomthing: "Making the hacky fixes and unclean code in chapter 6 of Platformer from Scratch less awful"
published: false
---

Hello again, my favorite code padawans! In this article, we'll replace the buggy and overall awful code from chapter 6 of PFS with something that works better and is cleaner, taking inspiration from the GameManager in the original Platformer. This is an *unofficial* chapter, remember, so it doesn't follow the PFS flow and isn't part of the PFS book.

## U-1.1: Resetting everything

(Name because unofficial chapter 1 section 1)

Let's start by deleting all of our level management *and* gameloop code. The only thing you should keep is `const FirstLevel` and `const SecondLevel` (and the code inside them). This, of course, is not the all of it; we also must change up the `Game`'s code: start by storing two booleans (as false), `win` and `die` under the game in it's constructor. If you can't figure it out, you haven't been paying very good attention. Now, delete the `win` and `die` functions on `Game`. In `Player`'s `specialCollision` function, change `this.game.win();` to `this.game.win = true;`, and follow the same pattern for `this.game.die()`.