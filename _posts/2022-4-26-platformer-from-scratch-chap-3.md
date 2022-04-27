---
name: "Platformer From Scratch chapter 3"
bottomthing: "Physics"
---

Welcome, friendly JS developers, to the third installment of Platformer From Scratch! In this chapter, we'll finish the physics engine: velocity, collisions, and true player control.

### 3.1: Velocity and Motion

Because collisions are fairly complicated and require lots of testing, let's first prepare the velocity system. In PhysicsObject's `constructor`, store two new values: `xv` and `yv`, and set them both to zero. We'll make this more configurable later.

```javascript
constructor(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.xv = 0;
    this.yv = 0;
}
```

Xv stands for X Velocity, and yv stands for Y Velocity. Every frame, we'll move the object by those velocities, and we can apply friction and gravity to them. For friction and gravity, save two more values in the aforementioned constructor: `friction` and `gravity`. Gravity should be around 1 because it's linear acceleration, and friction should be around 0.8 because it's exponential deceleration; you can customize it all you want, however. (Linear acceleration means it accelerates by the same amount every frame, exponential deceleration means it decreases by a smaller amount every frame as the initial value decreases, like real friction).

Now, in the "loop" function, add two calls: `this.yv += this.gravity;` and `this.xv *= this.friction`.<collapsible-footnote citationname = "[1]">The *= operator multiplies a variable by something, then sets the variable to that. An expansion of this is <code class = "language-plaintext">this.xv = this.xv * this.friction;</code></collapsible-footnote> Every frame, gravity makes Y velocity increase, and friction makes X velocity decrease. We still don't actually use these modified values; we can do it with two statements: `this.move(this.xv, 0);` and `this.move(0, this.yv)`. Do you notice something wrong? Yep, you're right! We could just do `this.move(this.xv, this.yv)`, however, collisions are handled one velocity at a time, rather than both velocities at once, so we have to split up the command. Your PhysicsObject `loop` should now look like this:

```javascript
loop(){
    this.xv *= this.friction;
    this.yv += this.gravity;
    this.move(this.xv, 0);
    this.move(0, this.yv);
}
```

If you run this, you'll notice something peculiar: the brick moves downwards at a constant rate. This is because the player is moving too, which counteracts the acceleration. We need to make it so only the player moves; we can do this by specifying a boolean<collapsible-footnote citationname="[2]">A boolean is either <code class="language-plaintext">true</code> or <code class="language-plaintext">false</code>.</collapsible-footnote> property specifying whether an object is *static* or not. A static object, quite simply, does not have any physics; it only exists for collisions. Add a new argument `isStatic` to the constructor of PhysicsObject, and store it with `this.value = value` syntax, then in the `loop` function of PhysicsObject add `if (!this.isStatic){` at the very start, tab up the function code after it (in Atom, just select it all and click tab), then create a newline and add `}` on it, to close the if statement. Congratulations, you've wrapped code in an `if` statement; if you look, you'll see the curly braces are formed the same way as a function. Inside the parenthesis is a *boolean expression*, which starts with `!`, also known as logical not<collapsible-footnote citationname = "[3]">Logical Not just takes a boolean value and flips it, so <code>true</code> becomes <code>false</code> and <code>false</code> becomes <code>true</code></collapsible-footnote>, runs it on `this.isStatic`, and then if that evaluates to `true`, runs the code in the curly braces. Thus, if `this.isStatic == false`, it *is not* static, and runs physics; otherwise, it ignores physics. Your PhysicsObject code should now look like this:

```javascript
class PhysicsObject{
    constructor(x, y, width, height, isStatic){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.xv = 0;
        this.yv = 0;
        this.gravity = 1;
        this.friction = 0.8;
        this.isStatic = isStatic;
    }

    loop(){
        if (!this.isStatic){
            this.xv *= this.friction;
            this.yv += this.gravity;
            this.move(this.xv, 0);
            this.move(0, this.yv);
        }
    }

    move(xm, ym){
        this.x += xm;
        this.y += ym;
    }
}
```

If you run it, it'll still do the same thing! We need to actually define some entities as static or not. Fortunately, our API supports this: edit the `_create` function in `class Game` to set the brick's`isStatic` to `true` when the constructor is called, it should now look like this:

```javascript
_create(x, y, width, height, style, type){
    var b = new Brick(this, x, y, width, height, style, type, true); // Put it in a variable so we can return it later
    this.tileset.push(b); // Add it to the tileset
    return b; // Return it, so you can call this function and then do operations immediately.
}
```

Run it, and nothing changed. This is because the `class Brick` constructor doesn't support static yet! In the constructor of `Brick`, add a new argument: `isStatic`, and pass it into the `super()` call like so:

```javascript
constructor(game, x, y, width, height, style, type, isStatic){
    super(x, y, width, height, isStatic);
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

If you run it, the brick should accelerate up rapidly! This is because it's perspectived - the player is falling. You might also notice something strange about the code: the player doesn't have any isStatic set, and yet it works! This is because in Javascript, if you don't set something, it defaults to `undefined`, and `!undefined` is `true`. Nice and intuitive!

### 3.2: Prototype Map

In the next section, we'll build the collisions engine; but we need things to collide with. Let's build a simple map that the player will eventually land on. You can simply use the basic 6-block line: `game.create(-2, 4, 6, 1, "normal", "solid");`. There is no need to store it to a variable. I recommend you play with it a bit: a more fun and more effective testing level would be:

```javascript
game.create(-2, 4, 6, 1, "normal", "solid");
game.create(-2, 3, 1, 1, "normal", "solid");
game.create(3, 3, 1, 1, "normal", "solid"); // This is just the basic rimmed floating platform, it's good for testing X collisions.
```

Variations of that one are my favorite type of test level.

### 3.3: Beginning the physics engine

Let's start on the physics engine (in the next section, we'll enable more advanced physics). Start by creating a new function on the `Game` class:

```javascript
checkCollision(object, objects = this.tileset){
    
}
```

Immediately, you will notice something strange. Did we just declare a variable as an argument? No. It's called a default argument (or parameter if you prefer that), and it's used in the case that we don't always want to pass an argument. If you need more clarification, zip right over to our best friends [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters)! We expect `objects` to always be an array of `PhysicsObjects` (or PhysicsObject child types, like Bricks or Players), so it allows us to refine collisions. Basically, when we do a collision check, if it turns out to be touching things, we have to go backwards until it's not touching. This gets very computationally expensive for large tilesets, so we can make it faster by simply only re-checking the things that we're already touching. (`object` is the thing we're checking for, it should be a `PhysicsObject`.) We must now use forEach:

```javascript
checkCollision(object, objects = this.tileset){
	objects.forEach((item, index) => { // Arrow functions yay!
        
    });
}
```

And thennn..... What? Well, we have to use the rectangle overlapping formula, which is happily not expensive at all and is very simplistic. Basically, two rectangles overlap on the X axis in the case that all these conditions are satisfied:

* The second edge of the first rectangle is further to the right than the first edge of the second rectangle, and
* The first edge of the first rectangle is further to the left than the second edge of the second rectangle

And the same rule applies for the Y axis but the conditions are slightly different:

* The bottom edge of the first rectangle is further down than the top edge of the second rectangle, and
* The top edge of the first rectangle is further up than the bottom edge of the second rectangle

Here's an example collision code between two PhysicsObjects (you can copy/paste this, but you shouldn't):

```javascript
// Assuming there are two PhysicsObjects, one called Rect1 and the other called Rect2. You'll have to create them to test this.
if (rect1.x + rect1.width > rect2.x && // && means "and"
    rect1.x < rect2.x + rect2.width &&
   	rect1.y + rect1.height > rect2.y &&
   	rect1.y < rect2.y + rect2.height){
    alert("They collide!"); // If you want, you can actually test this; the alert will tell you if it worked or not!
}
```

The `checkCollision` function should now look like this:

```javascript
checkCollision(object, objects = this.tileset){
    objects.forEach((item, i) => {
        if (object.x + object.width > item.x && // && means "and"
            object.x < item.x + item.width &&
            object.y + object.height > item.y &&
            object.y < item.y + item.height){
            // Your collision code here
        }
    });
}
```

Now, define a collisions dictionary like this:

```javascript
var collisionsDict = {
    "solid": [0, []], // Remember the word "solid" from when you created a brick? This references that!
    "allBricks": [0, []], // Each entry stores an array containing a number (the number of things in it) and another array, the things themselves.
    "allPlayers": [0, []], // Every player in the collision. Above is every block.
    "all": [0, []] // Everything.
}
```

We aren't going to worry about players yet (that's for enemy physics), but we should start with making "all" work. Inside that big hairy collision `if`, add

```javascript
if (item.type != undefined){ // Don't do this for items that don't have a type, it'll break if you do!
    collisionsDict[item.type][0] ++; // Increment the first item (javascript is 0 indexed, meaning 0 is the first item in a list)
    collisionsDict[item.type][1].push(item); // Add the item to the array at index 1 (the second element)
}
collisionsDict["all"][0] ++; // Same but for "all". Note that this is not inside the type-protection if; all things are treated equally here.
collisionsDict["all"][1].push(item);
```

Finally, we must return the `collisionsDict` so it can be used by the physics object that calls the `checkCollision` function by putting `return collisionsDict;` at the end of the function.

Your `checkCollision` function should now look like:

```javascript
checkCollision(object, objects = this.tileset){
    var collisionsDict = {
        "solid": [0, []], // Remember the word "solid" from when you created a brick? This references that!
        "allBricks": [0, []], // Each entry stores an array containing a number (the number of things in it) and another array, the things themselves.
        "allPlayers": [0, []], // Every player in the collision. Above is every block.
        "all": [0, []] // Everything.
    }
    objects.forEach((item, i) => {
        if (object.x + object.width > item.x && // && means "and"
            object.x < item.x + item.width &&
            object.y + object.height > item.y &&
            object.y < item.y + item.height){
            if (item.type != undefined){ // Don't do this for items that don't have a type, it'll break if you do!
                collisionsDict[item.type][0] ++; // Increment the first item (javascript is 0 indexed, meaning 0 is the first item in a list)
                collisionsDict[item.type][1].push(item); // Add the item to the array at index 1 (the second element)
            }
            collisionsDict["all"][0] ++; // Same but for "all". Note that this is not inside the type-protection if; all things are treated equally here.
            collisionsDict["all"][1].push(item);
        }
    });
    return collisionsDict;
}
```

Now, let's start making PhysicsObject use it. Before we can do anything else, we need to define collision typing: add in the PhysicsObject constructor two new saved arrays, `collisions` and `specialCollisions`. `collisions` should contain things that it collides with as solid, and `specialCollisions` things that it reports as having collided but doesn't process as solid. The constructor should now look like this:

```javascript
constructor(x, y, width, height, isStatic){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.xv = 0;
    this.yv = 0;
    this.gravity = 1;
    this.friction = 0.8;
    this.isStatic = isStatic;
    this.collisions = ["solid"]; // Solid is always a collision!
    this.specialCollisions = []; // No default special collisions.
}
```

Now that that's done, define a new function on PhysicsObject called `doCollision`, it should take a collision dictionary (argument name `coll`):

```javascript
doCollision(coll){
    
}
```

The idea is that it will return `true` if there's still an acknowledged solid collision, and `false` (or `undefined`) otherwise; and calling `return` in an arrow function just ends the arrow function (so it doesn't work in `forEach`), we must define a returner variable that we can edit from within an arrow function: `var returner = [false, []];` at the very start of the `doCollision` function should work, and we can define the `forEach` on... what? It doesn't work on dictionaries like the collision dictionary, and that would be superfluous anyways; we want to iterate over things that it considers to be solid; `this.collisions.forEach` (you can fill in the rest of the `forEach` call) should do it.

In the forEach, you need to now check if the appropriate collision type is non-zero:

```javascript
if (coll[item][0] > 0){
    returner[0] = true;
    returner[1].push(...coll[item][1]); // This is unpacking magic.
}
```

This semi-magical part is harder to explain and a full explanation is out of the scope of this tutorial; for now I will simply link you to the relevant MDN articles for [unpacking (spreading)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) and [pushing data to a list](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push). Basically, if it's touching something that applies, it pushes all of the applying elements to the return list and sets the return to true. It may set the return to true many times, but it only actually means anything once; the element application is, however, useful.

Finally, to finish up our function, we must add a `return returner;` at the end. Does this look somewhat familiar? This is just a filter designed to wrap over `checkCollision`; it has to return a value as well. Your entire function - under `PhysicsObject` - should thus now look like:

```javascript
doCollision(coll){
    var returner = [false, []];
    this.collisions.forEach((item, i) => {
        returner[0] = true;
        returner[1].push(...coll[item][1]); // This is unpacking magic.
    });
    return returner;
}
```

In chapter 4, we'll implement special collisions and callback methods; for now, this doCollision function is sufficient.

### 3.4: Finishing the collision engine

Now we need to use the methods we've been developing to do actual collisions. Start by changing up the constructor of PhysicsObject: adding and storing a `game`. I recommend putting it before `x` in the arguments list for cleanliness. In the `Brick` constructor, pass `game` into the `super` call in the proper order, this is for you to figure out too. Add it in the same way to Player (you'll have to get a new argument and pass it in when the player is created in the Game constructor). The PhysicsObject, Brick, Game, and Player constructors should now look like below:

```javascript
// Brick
constructor(game, x, y, width, height, style, type, isStatic){
    super(game, x, y, width, height, isStatic);
    this.game = game;
    this.element = document.createElement("div");
    document.getElementById("game").appendChild(this.element);
    this.type = type;
    this.element.classList.add(style);
    this.element.classList.add(type);
    // This happens last!
    this.draw();
}

// PhysicsObject
constructor(game, x, y, width, height, isStatic){
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.xv = 0;
    this.yv = 0;
    this.gravity = 1;
    this.friction = 0.8;
    this.isStatic = isStatic;
    this.collisions = ["solid"]; // Solid is always a collision!
    this.specialCollisions = []; // No default special collisions.
}

// Player
constructor(game, x, y, width, height){
    super(game, x, y, width, height);
    this.element = document.createElement("div");
    document.getElementById("game").appendChild(this.element);
    this.element.classList.add("player");
    this.draw();
}

// Game
constructor(blockWidth, blockHeight){
    this.blockWidth = blockWidth;
    this.blockHeight = blockHeight;
    this.tileset = [];
    this.player = new Player(this, 50, 0, this.blockWidth, this.blockHeight * 2); // Players are usually 1x2 blocks. Feel free to change as you wish.
}
```

You should next go into the `PhysicsObject` `loop` function, right after the second `this.move` call (should be the one for yv) and do `var coll = this.doCollision(this.game.checkCollision(this));`. This is rather knotty and gnarled, so let's go through it step-by-step:

* `var coll =`: `var` is the variable keyword, so this tells it to create a new variable called `coll` and set it to whatever is after the `=`.
* `this.doCollision`: We just defined this function. It weeds out collision candidates from a collision dictionary.
* `this.game.checkCollision(this)`: Get a collision dictionary from an object.

Now, we want to check if it hit anything:

```javascript
if (coll[0]){
    // Code in here runs if it's hitting something
}
```

Because we set `coll[0]` to `true` if it hits something, we can just check it in the if statement, this makes code easy. The next part, which goes inside the `if` statement, isn't nearly so simple:

```javascript
while (this.doCollision(this.game.checkCollision(this, coll[1]))[0]){
    // The code in here runs until it stops hitting things.
}
```

Let's disect this.

* `while`: Like `if`, while does something based on a boolean case; unlike `if`, `while` keeps doing it until the test case returns false.
* `this.doCollision(this.game.checkCollision())`: We've already seen this, so I'm not going to explain it again.
* `this`: Yep, old news.
* `coll[1]`: This is more interesting. It tells the checkCollision code to only iterate over the bricks it's touching right now, which makes it significantly faster for larger levels (I've explained the optimization reason once before, if this sounds familiar).
* `[0]`: Check the first value of the returned array, which is a boolean: `true` for touching, `false` for not.

If you run it now, the player will drop, hover over the bricks for a couple seconds, then your browser will either crash or tell you the page is slowing it down. This is because the while loop never terminates - the player doesn't move backwards yet. In the while loop, add `this.move(0, -Math.abs(this.yv)/this.yv)`: Uh-oh, yet another hairy one! We'd better disect this.

* `this.move`: This moves a PhysicsObject.
* `0`: Don't move on the x-axis, we need to rebound on the y-axis.
* `-Math.abs(this.yv)`: the `Math.abs` function returns the distance from 0, so a negative number will become positive and a positive number will stay positive. The `-` sign basically inverts it, so it will always return a negative number, the negative value of `this.yv`.
* `/this.yv`: This is a trick of arithmetic. A number divided by itself always returns 1, but a number divided by -itself is always -1, right? Because of the negative abs function, we know that if `this.yv` is, say, 4 it will become -1, so it will *move backwards*, and if it's -4, it will return 1, still *moving backwards*.

If you run this now, Player will hit the platform and stay there for a couple seconds, before falling back through at tremendous speed. This happens because `yv` keeps accumulating, and eventually gets so high that Player can pass through the platform without hitting it (because of the way xv and yv are controlled). This can, however, be solved by setting `yv` to zero when it hits the platform, so it can't build up enough speed to puncture through. We can do that now, by adding `this.yv = 0;` at the end of the `if` statement (after the `while`). Your full `loop` function should now look like this:

```javascript
loop(){
    if (!this.isStatic){
        this.xv *= this.friction;
        this.yv += this.gravity;
        this.move(this.xv, 0);
        this.move(0, this.yv);
        var collY = this.doCollision(this.game.checkCollision(this));
        if (collY[0]){
            while (this.doCollision(this.game.checkCollision(this, collY[1]))[0]){
                this.move(0, -Math.abs(this.yv)/this.yv);
            }
            this.yv = 0;
        }
    }
}
```

Note: if the display seems fuzzy or jittery, it's because you put the collision code after the xv code instead of the yv.

Let's add the same thing to xv, which fortunately shouldn't be too hard as we can just copy/paste and replace yv with xv (you should rewrite it yourself if you don't have a firm grasp on the logic, though). Do make sure to flip the 0 and the math in the rebound move command, though, otherwise it'll break. Your final loop code should look very similar to this:

```javascript
loop(){
    if (!this.isStatic){
        this.xv *= this.friction;
        this.yv += this.gravity;
        this.move(this.xv, 0);
        var collX = this.doCollision(this.game.checkCollision(this));
        if (collX[0]){
            while (this.doCollision(this.game.checkCollision(this, collX[1]))[0]){
                this.move(-Math.abs(this.xv)/this.xv, 0);
            }
            this.xv = 0;
        }
        this.move(0, this.yv);
        var collY = this.doCollision(this.game.checkCollision(this));
        if (collY[0]){
            while (this.doCollision(this.game.checkCollision(this, collY[1]))[0]){
                this.move(0, -Math.abs(this.yv)/this.yv);
            }
            this.yv = 0;
        }
    }
}
```

You can move the player around and make it jump by changing `game.player.xv` and `game.player.yv` in the console, such as `game.player.xv += 10` or `game.player.yv -= 20` to jump. You'll find that it actually works very well and beauteous; everything seems solid now!

There's one final change we need to make. Right now, the player can hit things, but we don't know what part of the player is hitting what, which is a problem. We can start fixing it by using four new values in the PhysicsObject loop function: `touchingTop`, `touchingBottom`, `touchingLeft`, and `touchingRight`. They should all be set to false each iteration, like so:

```javascript
// All of this goes before the rest of the physics code
this.touchingTop = false;
this.touchingBottom = false;
this.touchingLeft = false;
this.touchingRight = false;
```

You might notice something wrong with this: they are never initialized in the constructor! We can, however ignore that; this is yet another quirk of Javascript: you can define new members in any function, not just `constructor`. As long as they're set before you attempt to read them, it works perfectly.

Now, in your PhysicsObject collision code for y, add this:

```javascript
... // Don't actually put three dots there, these three dots reference the code before.
if (this.yv > 0){ // Positive velocity = moving down
    this.touchingBottom = true;
}
else if (this.yv < 0){ // Negative velocity = moving up
    this.touchingTop = true;
}
this.yv = 0; // This is the original one, not a new one; it serves to demonstrate where to place the new code.
```

This works because if Y velocity is positive, it's moving downwards and hitting with the bottom part of the rectangle. Knowing that, the logic applies to everything else. Knowing this logic, add this for x:

```javascript
...
if (this.xv > 0){ // Positive velocity = moving right
    this.touchingRight = true;
}
else if (this.xv < 0){ // Negative velocity =  moving left
    this.touchingLeft = true;
}
this.xv = 0; // This is the original one, not a new one; it serves to demonstrate where to place the new code.
```

That was a bunch of confusing stuff, so if you have issues you can use this code as a reference (I disabled copy/paste for just this one):

<pre class="noselect">
<code class="language-javascript">
class PhysicsObject{
    constructor(game, x, y, width, height, isStatic){
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.xv = 0;
        this.yv = 0;
        this.gravity = 1;
        this.friction = 0.8;
        this.isStatic = isStatic;
        this.collisions = ["solid"]; // Solid is always a collision!
        this.specialCollisions = []; // No default special collisions.
    }

    loop(){
        if (!this.isStatic){
            this.touchingTop = false;
            this.touchingBottom = false;
            this.touchingLeft = false;
            this.touchingRight = false;
            this.xv *= this.friction;
            this.yv += this.gravity;
            this.move(this.xv, 0);
            var collX = this.doCollision(this.game.checkCollision(this));
            if (collX[0]){
                while (this.doCollision(this.game.checkCollision(this, collX[1]))[0]){
                    this.move(-Math.abs(this.xv)/this.xv, 0);
                }
                if (this.xv > 0){ // Positive velocity = moving right
                    this.touchingRight = true;
                }
                else if (this.xv < 0){ // Negative velocity =  moving left
                    this.touchingLeft = true;
                }
                this.xv = 0;
            }
            this.move(0, this.yv);
            var collY = this.doCollision(this.game.checkCollision(this));
            if (collY[0]){
                while (this.doCollision(this.game.checkCollision(this, collY[1]))[0]){
                    this.move(0, -Math.abs(this.yv)/this.yv);
                }
                if (this.yv > 0){ // Positive velocity = moving down
                    this.touchingBottom = true;
                }
                else if (this.yv < 0){ // Negative velocity = moving up
                    this.touchingTop = true;
                }
                this.yv = 0;
            }
        }
    }
    
    doCollision(coll){
        var returner = [false, []];
        this.collisions.forEach((item, i) => {
            if (coll[item][0] > 0){
                returner[0] = true;
                returner[1].push(...coll[item][1]); // This is unpacking magic.
            }
        });
        return returner;
    }
    
    move(xm, ym){
        this.x += xm;
        this.y += ym;
    }
}
</code>
</pre>

You can play with it a bit more, you'll notice that only for one frame do the `game.player.touchingLeft` and `game.player.touchingRight` stay true when you hit one of the sidewalls! This is because the "rebound" prevents the player from ever actually touching them when xv reaches 0.

### 3.5: Keyboard Controls

Now that we have a physics engine, we can start on player interaction. First, define a `Jump` function on the Player class; it should take no arguments. Inside it, put

```javascript
if (this.touchingBottom){
	this.yv = -20;
}
```

It should thus look like:

```javascript
Jump(){
    if (this.touchingBottom){
		this.yv = -20;
	}
}
```

You can run now, then in the console type `game.player.Jump()` (if you don't have a Game defined called `game`, you didn't pay any attention to chapter 2) and it will jump! You can try it in quick succession, and you'll notice you can not jump unless you're touching the ground.

Note: in original Platformer, which I wrote several years ago meaning the code is somewhat awful, I have a bug that I will never fix (it's too integral to the game) that allows you to multijump under some conditions. I will not demonstrate how to do that in this tutorial, unless I include a snippet in chapter 5; in any case, Platformer from Scratch's physics engine has this bug fully fixed.

Now, add two more functions: `Left` and `Right`. These should simply change xv, I'll let you figure it out and tweak it about until it feels good (as always, a finalized code is in the chapter folder on github, linked below). You can test them in the console with `game.player.Left()` or `game.player.Right()`.

Let's start adding keyboard input. This is a fairly simple task, just a matter of storing keyboard values. Add this in the Player constructor, to start out:

```javascript
this.keysHeld = {}; // {} means a new dictionary-like object.
document.addEventListener("keydown", (event) => {
   this.keysHeld[event.key] = true; 
});
document.addEventListener("keyup", (event) => {
    this.keysHeld[event.key] = false;
});
```

You can probably guess from context that this waits until a key is pressed, then sets that key's entry in `this.keysHeld` to `true`; if that key is released (up), it sets the value to `false`. `document.addEventListener` takes two arguments: a name and a function. In this case we use an arrow function. The names of the events are "keydown" and "keyup", which mean exactly what you might think!

We can now use `this.keysHeld` for actual player motion. In `Player`, create a new function `loop`. The first command in it should be `super.loop()`, because we want the PhysicsObject loop to run. Add this code to it:

```javascript
if (this.keysHeld["ArrowUp"]){
    this.Jump();
}
if (this.keysHeld["ArrowLeft"]){
    this.Left();
}
if (this.keysHeld["ArrowRight"]){
    this.Right();
}
```

It just checks which keys are pressed, and if they are, does the appropriate motion. Nice and simple! Your `Player`'s `loop` function should now look like this:

```javascript
loop(){
    super.loop();
    if (this.keysHeld["ArrowUp"]){
        this.Jump();
    }
    if (this.keysHeld["ArrowLeft"]){
        this.Left();
    }
    if (this.keysHeld["ArrowRight"]){
        this.Right();
    }
}
```

Now, assuming everything worked, you should be able to actually play your basic level!

### 3.6: Wrapping Up

Over this chapter, we went from having basic moving graphics to having an actual running physics engine and player motion! In chapter 4, we'll add custom blocks (with custom physics rules), which include coins and enemies, until then, play around with making your own maps via create commands. See ya soon!

As always, you can view the code for this chapter [here](https://github.com/LinuxRocks2000/platformer-from-scratch/tree/master/chapter-3).

