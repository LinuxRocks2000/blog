---
name: "Platformer From Scratch chapter 2"
---

Welcome back, padawan gamedevs! In this chapter of Platformer from Scratch, we're going to: add a player and change our render code to support it, and add a game loop.

### 2.1: Adding the Player

Because we're doing object-oriented programming, there needs to be a Player class. Start with `class Player extends PhysicsObject` and add the customary curly braces and constructor. The constructor should, as always, take the arguments `x`, `y`, `width`, and `height` to feed the `super()` function; don't add anything else yet. You should also create an element and store it to the player object, then give it the CSS class "player" (we've already done CSS for the player class!), then add it to the game object. Your class code should thus look like this:

```javascript
class Player extends PhysicsObject{
    constructor(x, y, width, height){
        super(x, y, width, height);
        this.element = document.createElement("div");
        document.getElementById("game").appendChild(this.element);
        this.element.classList.add("player");
    }
}
```

Players need a draw function too, so let's give it one. If you recall how we made the draw function in chapter 1, it should be basically the same thing, setting CSS properties.

```javascript
draw(){
    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";
    this.element.style.width = this.width + "px";
    this.element.style.height = this.height + "px";
}
```

You can now create a player the same way you'd create a brick, just without the type and style arguments. However, there is something wrong with this! I'll let you figure out what is omitted that prevents Player from displaying when you create it. Need a hint? We did the same thing in chapter 1 but for bricks.



I'm just going to assume you found the issue because I'm annoying that way; if you didn't, just check the code on GitHub. You should now have a working player render and it is time to start putting it all together in the Grand Unified Game Class!

Your full Player class should thus look like:

```javascript
class Player extends PhysicsObject{
    constructor(x, y, width, height){
        super(x, y, width, height);
        this.element = document.createElement("div");
        document.getElementById("game").appendChild(this.element);
        this.element.classList.add("player");
        this.draw();
    }

    draw(){
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
        this.element.style.width = this.width + "px";
        this.element.style.height = this.height + "px";
    }
}
```

### 2.2: The Game Class and Player Perspective

Begin another class, name it `Game`, but this time don't use `extends PhysicsObject`, because the game itself doesn't collide with anything. The game's job is to do updates, check collisions, and send render commands, not to be an active element of itself. Another thing the game does is create the world, including every brick, and that's what we're going to start with. The constructor of the Game class should take two arguments: blockWidth and blockHeight. Save them to the object with the `this.value = value` syntax. You also need to add a tileset list, your constructor should thus look like:

```javascript
constructor(blockWidth, blockHeight){
    this.blockWidth = blockWidth;
    this.blockHeight = blockHeight;
    this.tileset = [];
}
```

Note that `[]` creates an empty list, and we use the `this.value = value` saving syntax to store it as `this.tileset`.

Each game exists to hold a single player, so create a new player and store it to the game:

```javascript
this.player = new Player(0, 0, this.blockWidth, this.blockHeight * 2); // Players are usually 1x2 blocks. Feel free to change as you wish.
```

Now, add another function, this one called `_create`, like so:

```javascript
_create(x, y, width, height, style, type){
    var b = new Brick(x, y, width, height, style, type); // Put it in a variable so we can return it later
    this.tileset.push(b); // Add it to the tileset
    return b; // Return it, so you can call this function and then do operations immediately.
}
```

This is clearly just a wrapper for bricks that appends them to the tileset, so we can control them later. Now, for the much sought-after size-aligned create function:

```javascript
create(x, y, width, height, style, type){
    return this._create(x * this.blockWidth, y * this.blockHeight, width * this.blockWidth, height * this.blockHeight, style, type);
}
```

Another wrapper! This one multiplies every shape value by `this.blockWidth` and `this.blockHeight`, so if you call it with `(1, 1, 2, 1, "normal", "solid")` and your blockWidth and blockHeight are both 50, it will give you a 100x50 brick at (50, 50). Your full Game class code should look like this:

```javascript
class Game {
    constructor(blockWidth, blockHeight){
        this.blockWidth = blockWidth;
        this.blockHeight = blockHeight;
        this.tileset = [];
        this.player = new Player(0, 0, this.blockWidth, this.blockHeight * 2); // Players are usually 1x2 blocks. Feel free to change as you wish.
    }

    _create(x, y, width, height, style, type){
        var b = new Brick(x, y, width, height, style, type); // Put it in a variable so we can return it later
        this.tileset.push(b); // Add it to the tileset
        return b; // Return it, so you can call this function and then do operations immediately.
    }

    create(x, y, width, height, style, type){
        return this._create(x * this.blockWidth, y * this.blockHeight, width * this.blockWidth, height * this.blockHeight, style, type);
    }
}
```

Now, we want to start adding perspective. Basically, perspective means that no matter what the player is always at the center of the screen: the first part is making it so that every time the player moves a pixel, the entire game *including the player* moves -1 pixels. We can achieve this through math, but we need to have access to the player object, so let's change up the Brick constructor by adding a new argument `game` and storing it with `this.value = value` notation. You should insert it before the other arguments for ease.

If your Brick constructor doesn't look like this, you're doing something wrong:

```javascript
constructor(game, x, y, width, height, style, type){
    super(x, y, width, height);
    this.game = game;
    this.element = document.createElement("div");
    document.getElementById("game").appendChild(this.element);
    this.type = type;
    this.element.classList.add(style);
    this.element.classList.add(type);
    // This happens last!
    this.draw();
}
```

Now, change up the `_create` function to pass in `this` to the Brick constructor (`this` is a reference to the context of the function, which is in this case the game). It should now look like this:

```javascript
_create(x, y, width, height, style, type){
    var b = new Brick(this, x, y, width, height, style, type); // Put it in a variable so we can return it later
    this.tileset.push(b); // Add it to the tileset
    return b; // Return it, so you can call this function and then do operations immediately.
}
```

Only one tiny change; I promise the next ones will be larger and more complicated.

The formula for *x* of a brick with the perspective *playerX* of a player is just *perspectiveX* = *x* - *playerX*. This calculation should ONLY happen in render code; the player is the thing that is moving, but it drags the camera with it.

Note: The formula for Y is the same.

Now, edit the `Brick` `draw` function to use this formula. Note that you don't have to actually copy the formula; just use it as a baseline. Your brick's draw code should look thus:

```javascript
draw(){
    this.element.style.width = this.width + "px";
    this.element.style.height = this.height + "px";
    this.element.style.left = (this.x - this.game.player.x) + "px";
    this.element.style.top = (this.y - this.game.player.y) + "px";
}
```

Now, if you put the player at a different x or y position, it moves and the brick moves backwards. This is a problem! The player should never move. We can fix this pretty easily, however, in the draw function. Can you figure out how? Here's a hint: if you do it the way you did it the Brick `draw`, it's not the most efficient method. As always, the optimized version is in the code.

If we want it to be centered, which is certainly desirable, we need to do one more computation. The formula for centering any object relative to an external width and the object's width is just `(outer_width - inner_width) / 2`, which is the averaging formula. The outer width in this case is stored in `window.innerWidth` and the height in `window.innerHeight` (as you can see, the formula is the same for y). Change it up in the `Player` `draw` function, the part where you set `top` and `left` should now look like:

```javascript
this.element.style.left = (window.innerWidth - this.width) / 2 + "px";
this.element.style.top = (window.innerHeight - this.height) / 2 + "px";
```

Load it again - you'll see Player in the middle of the screen. If you draw a brick, however, it's still in the same place! What happened? This is because all you changed is how it looks, not anything about where it is in the game's memory. We can also change this in the brick code, but remember that it has to be relative to the *player*'s width and height, not the brick's width and height. The referenced part of the brick draw function should now be like this:

```javascript
this.element.style.left = (this.x - this.game.player.x + (window.innerWidth - this.game.player.width) / 2) + "px";
this.element.style.top = (this.y - this.game.player.y + (window.innerHeight - this.game.player.height) / 2) + "px";
```

Yay, now everything is perspectived against the player!

### 2.3: Gameloop

The game loop is one of the less strenuous parts of the program to code. It's just a function under the `Game` class, one which: calls every block's `loop` (not created yet) and `draw` functions, then calls the player's `loop` (not yet created) and `draw` functions. Eventually, we'll implement `loop` as part of PhysicsObject and we'll be able to do actual physics with velocities, but for now those functions will do nothing. Let's start by adding the new function to avoid errors: in `PhysicsObject`, add a new `loop` function in front of `constructor`. `PhysicsObject` should now look like this:

```javascript
class PhysicsObject{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    loop(){
        
    }
}
```

Now, we can add the loop to the Game class! First, create a function `loop`, the same way as you did on PhysicsObject, but on Game. Remember, nothing in the parenthesis! Now, we must visit an interesting concept: the `forEach`. A `forEach` iterates over every value in an array, giving a *callback* the value and the index. The callback is often an *arrow function*, defined like so: 

```javascript
// This is an Arrow Function example; it shouldn't go in your main code.
var arrowFun = (value) => {
    alert(value);
}

arrowFun("Hello!"); // Alerts "hello"
```

Thus, you can use `.forEach` like this:

```javascript
myArray = ["hello", "world"]; // The block array uses .push instead of directly initializing it like right here

myArray.forEach((item, i) => {
    alert(item);
});

// Should alert, in order, "hello" and "world". You can add more to the array the same way.
```

Thus, this would go in the `loop` function:

```javascript
this.tileset.forEach((item, i) => {
   // Your code per block here. 
});
```

And then, inside the arrow function, place `item.loop();` and `item.draw();`.

Outside the arrow function, inside the normal function space, add `this.player.loop()` and `this.player.draw()`. Your overall function should now look like:

```javascript
loop(){
    this.tileset.forEach((item, i) => {
        item.loop();
        item.draw();
    });
    this.player.loop();
    this.player.draw();
}
```

You can reload and..... Nothing changed. This is because we defined functions but never called them. We need to create a frame-update function, and for this we must use `window.requestAnimationFrame`, a function which tells the browser to run another function that you pass it on the next frame of animation. This makes animation cleaner and allows you to align it to the window frame updating, which is very efficient because it means you don't interrupt the browser while it renders a page; it can also improve performance by preventing you from computing superfluous frames. `requestAnimationFrame` can also be called inside a function in which `requestAnimationFrame` was called, allowing you to do infinite loops; this is actually recommended by [MDN](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame). An example game loop is this (add it to your code, you'll have to anyways):

```javascript
function mainloop(){
    // Your code here
    window.requestAnimationFrame(mainloop);
}
window.requestAnimationFrame(mainloop);
```

For this to work, however, it must have a global game that it can loop every frame. A global variable is simply a variable that any function and any scope can access; they are defined outside of functions and classes. Technically a class definition is a global variable, but that's just more JS being annoyingly intuitive. In fact, you've probably already done this for testing; if you didn't, just declare a new game like so:

```javascript
var game = new Game(50, 50); // To truly customize it, you can make it things that aren't 50x50, but you should usually keep the blockWidth and blockHeight the same.
```

Now, you can add `game.loop()` to your mainloop at that comment, like so:

```javascript
function mainloop(){
    game.loop();
    window.requestAnimationFrame(mainloop);
}
window.requestAnimationFrame(mainloop);
```

And you're done with mainloops!

### 2.4: Motion

We've already covered the goals for this chapter and it's a little short, so let's start on making things move. The first thing you must do is update the PhysicsObject class, adding a `move` function, with two arguments: `xm` and `ym`. It should add `xm` to it's x position, and `ym` to it's y position; a useful operator you can use is `variable_name += value` which adds a value to a variable. If you set `x = 3` and you did `x += 3`, `x` would be equal to `6`. Here's the code for a `move` command for reference (or copy/paste, but that's not nearly as fun!):

```javascript
move(xm, ym){
    this.x += xm;
    this.y += ym;
}
```

The PhysicsObject class should now look like this:
```javascript
class PhysicsObject{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    loop(){

    }

    move(xm, ym){
        this.x += xm;
        this.y += ym;
    }
}
```

Run your program and enter the developer menu (`ctrl + shift + i` on most modern browsers), then in the console create a new brick with `var brick = game.create(1, 1, 1, 1, "normal", "solid");`. From here, you can do `brick.move(10, 0);` and the brick will move by 10 pixels to the right! Play with it a bit, and see you in chapter 3!

### 2.5: Wrapping Up

In this chapter, we went over building a gameloop, players, and motion, and finished our render engine. You should now be able to create and move bricks with relative intellectual ease; the next chapter will be a doozy if you can't.

In chapter 3, we'll go over adding velocity, collisions, and if we have time player motion. We'll build a small block world for prototyping, you may want to design that now if you want customization. See you then!

You can view the full code for this chapter at https://github.com/LinuxRocks2000/platformer-from-scratch/tree/master/chapter-2.