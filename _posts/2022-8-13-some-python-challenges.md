---
title: Some Python challenges, part 1
published: false
---

Well hello again, my favorite padawan coders! Recently, a relative started learning Python and requested some examples and problems to solve. Rather than simply give them to him, however, I've decided to post them here, so everybody can mess about with 'em. I'll define scores for solutions to the problems. Scores don't stack - the highest one that applies is your score for that answer. Solutions are on the bottom. **No flexing about a score you got if you used the solutions!**

 Without further ado,

## Password lock

To keep your secrets secure. Write a program that inputs a password. If the password is wrong, just print "wrong", and if the password is right, print out the contents of your diary or whatever. "right" works too. If you want to take it up to another level, make it so it keeps asking the password infinitely until you get it right.

Sample outputs (where the password is "linuxrocks2000"):

* beep: no
* linuxrocks2000: I writest to thee, my dear diary, in distress, for I am in a most volatile predicament...

Score system:

* If it doesn't work, you get 0. This is implied, so I won't mention it again.
* 1 point if it asks 1 time
* 2 points if it asks infinitely until you get it right, then stops asking

## The rice problem

There is a legend that once upon a time, an emperor in China owed to a man a great favor. The man, rather than something particularly flamboyant, simply requested some rice. To measure the quantity, he said, the emperor was to place a single grain of rice on the first square of a chess board. The emperor did so, and the man explained that now, for every square on the chess board, the emperor must put an amount of rice equal to double that of the last square, then give the man all of it. The emperor did so, and was promptly bankrupted, because he was giving the man 2^0 + 2^1 + 2^2 + 2^3 ... 2^62 + 2^63. Your challenge is to devise a program that takes a number of chess squares as an input and returns the amount of rice the Emperor has to give the man as the output. Here are the first 3 input/output pairs:

* 1: 1
* 2: 1 * 2 + 1 = 3
* 3: 1 * 2 * 2 + 1 * 2 + 1 = 7

Wait. What? What's with all the addition? Simple. You aren't giving the amount on the square, you're giving the amount *on the chessboard*, so you're adding the value of #1, #2, and #3 to get the output at 3.

Score system:

* If you return only the value of the individual square, 1 point
* If you return the total value of the chessboard, 3 points

## Random Passwords

The government has stolen your secret password so you can't access your datavault. You need to get in there to find the miracle formula that will stop Doctor X's creature<collapsible-footnote citationname = "[1]">If you don't get this reference, you don't even have a life as a nerd.</collapsible-footnote>. Fortunately, from using the password a lot, you know that it's 10 characters, and that each character can be "1", "2", "3", "4", "5", "a", "c", "l", "f", or "x". Unfortunately, there are too many combinations for you to try to get it right in time, so you need a computer to do it for you. In other words, write a program that generates random passwords following the criteria above. It should test if the random password is equal to the actual password, and if it is, print "you've done it!". No matter what, it should print out the password it tried. There are various ways you can optimize it for extra points listed under the scoring system.

Hint: you'll need the `random` module.

Example outputs (there's no inputs in this one) where `aaclfx1524` is the right password:

* `15aclfx432`
* `aaclfx1524 You've done it!`

(Don't worry if the outputs don't exactly match the example)

Scoring system:

* It prints out random passwords until it gets the right one: 2 points
* It never prints out the same password twice: 4 points
* It isn't random, and instead "increments" them up continuously (if you don't understand, that's OK, you're just new and shouldn't attempt this): 10 points

## The basic calculator

This is a pretty classic one. Basically, you should make an arithmetic calculator that takes 2 numbers and an operator, then performs an operation and returns the result. You should support + (addition), - (subtraction), * (multiplication), and / (division).

Example input/outputs:

* ```
  First number: 2
  Operator: *
  Last number: 6
  Result is 12
  ```

* ```
  First number: 5
  Operator: /
  Last number: 5
  Result is 1
  ```

* ```
  First number: 10000
  Operator: -
  Last number: 9999
  Result is 1
  ```

Scoring system:

* If you got it to do any 1 of these operators, but not all of them, 2 points
* If you got it to do all of these operators, 5 points

## Typist: The game

Typist is a pretty simple game I made a while back. It's designed to teach you speed typing. Basically, it prompts you a series of letters and numbers and you have to copy them down in 10 seconds. If you mistype or exceed the time limit, you lose; if you succeed, you go up a level. On every new level, the difficulty increases and the number of letters does as well. You'll need the skills from the previous sections, and you'll also need the `time` module to measure how much time has passed. Good luck!

Hint: `time.time()` is the current time in seconds. You can use that to measure how much time a person took on an `input`.

Sample play (copied from a real game in my terminal):

```
Welcome to Typist, a game stupidly conceived by Tyler Clarke
The objective of the game: Copy the printed text in ten seconds, to advance to the next level. If you get past level 19: You win!
On three!
3
2
1
Go!
Copy this: zjbii
>>> zjbii
You have not died: On to the next challenge!
Your level: 1
On three!
3
2
1
Go!
Copy this: gFhtwb
>>> gFhtwb
You have not died: On to the next challenge!
Your level: 2
On three!
3
2
1
Go!
Copy this: FzcpseC
>>> FzcpseC
You have not died: On to the next challenge!
Your level: 3
On three!
3
2
1
Go!
Copy this: RjtpaEyw
>>> RjtpaEyw
You have not died: On to the next challenge!
Your level: 4
On three!
3
2
1
Go!
Copy this: nfhhAVsrq
>>> nfhhAVsrq
You have not died: On to the next challenge!
Your level: 5
On three!
3
2
1
Go!
Copy this: rCO5wOGIka
>>> rCO5wOGIka
You have not died: On to the next challenge!
Your level: 6
On three!
3
2
1
Go!
You have reached the boss. This is an achievement in itself - Type strongly, young jedi, or the boss will stomp on your throat.
Copy this: vS0PlYZ6SYb
>>> vS0PlYZ6SYb
You have not died: On to the next challenge!
Your level: 7
On three!
3
2
1
Go!
Copy this: L21AGFhUaVOqpQ8R47
>>> L21AGFhUaVOwpW8R47
Your have mistyped!
Your ending level: 7
```

Scoring system:

This one is more fragmented. Put the numbers together for your total.

If you got it to increase the number of letters on every new level, 1 point.

If you got it to add new letters, numbers, and symbols on every new level, 2 points.

If you got it to measure the amount of time you took and disqualify you if you failed the 10 second limit, 2 points.

If you got it to check if you answered correctly and disqualify you if you failed, 1 point.

If you got all of these, add +3 bonus points.

##
