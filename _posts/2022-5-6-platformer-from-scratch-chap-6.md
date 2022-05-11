---
name: "Platformer From Scratch chapter 6"
bottomthing: "Conclusively finishing the physics engine for the third time, bats, level management"
published: false
---

Welcome back! I know it's been a long time since my last PFS update - I had (have, if I publish this before May 9th) finals and an SAT. We're going to start today by revisiting the physics engine - I fiddled with it a bit and decided that, having reduced the number of cycles required for collisions, I would add this to chapter 6. So, yes, you can expect this to be a long one.

## 6.1: Physics absolutism

For a while, our physics engine has used Move+Rebound motion. This is inefficient and forced us to interject some `Math.round` calls, which makes itself obvious at very low virtual framerates (5-10): you'll find that when you jump and move to the side, you stay at one fixed height for much longer than you should, because your position keeps rounding. We're going to fix this now with an improvement on the rebound physics engine: it detects what direction it's moving in, then changes the X and Y positions of the player to be at the top or bottom of the object it hit. For this concept to work, we need to determine the closest block to the side you recognize it hits at, we can use four functions for this:

```javascript
function getRightmost(physicsObjects){
    var rightmostVal = Infinity;
    var rightmostObj = undefined;
    physicsObjects.forEach((item, i) => {
        if (item.x < rightmostVal){
            rightmostVal = item.x;
            rightmostObj = item;
        }
    });
    return rightmostObj;
}

function getLeftmost(physicsObjects){
    var leftmostVal = -Infinity;
    var leftmostObj = undefined;
    physicsObjects.forEach((item, i) => {
        if (item.x + item.width > leftmostVal){
            leftmostVal = item.x;
            leftmostObj = item;
        }
    });
    return leftmostObj;
}

function getTopmost(physicsObjects){
    var topmostVal = Infinity;
    var topmostObj = undefined;
    physicsObjects.forEach((item, i) => {
        if (item.y < topmostVal){
            topmostVal = item.y;
            topmostObj = item;
        }
    });
    return topmostObj;
}

function getBottommost(physicsObjects){
    var bottommostVal = -Infinity;
    var bottommostObj = undefined;
    physicsObjects.forEach((item, i) => {
        if (item.y + item.height > bottommostVal){
            bottommostVal = item.x;
            bottommostObj = item;
        }
    });
    return bottommostObj;
}
```

These all follow the same general theme, so I'll only explain `getRightmost` and `getLeftmost`; understanding those means you understand the other two. Let's disect `getRightmost` first:

```javascript
function getRightmost(physicsObjects){
    var rightmostVal = Infinity;
    var rightmostObj = undefined;
    physicsObjects.forEach((item, i) => {
        if (item.x < rightmostVal){
            rightmostVal = item.x;
            rightmostObj = item;
        }
    });
    return rightmostObj;
}
```

* `function getRightmost(physicsObjects)`: define a function outside of a class (hence "function") which takes the argument "physicsObjects"
* `var rightmostVal = Infinity;`: Infinity is the furthest *left* anything can get, and when we check how far right each block is, we want any block at all to register as true. This is a simple Javascript trick: `any_number < Infinity` is always true.
* `var rightmostObj = undefined;`: Set the right-most object, the thing we return, to `undefined`; we define it later.
* `physicsObjects.forEach`: forEach over physicsObjects, which is here revealed to be necessarily an Array.
* `if (item.x < rightmostVal)`: If this object is further right than the last one, it becomes the new object.
* `rightmostVal = item.x;`: Log the position as the rightmost object
* `rightmostObj = item;`: Log the actual item as the rightmost object
* `return rightmostObj;`: Return the furthest right object in that array.

Now, let's look at `getLeftmost`:

```javascript
function getLeftmost(physicsObjects){
    var leftmostVal = -Infinity;
    var leftmostObj = undefined;
    physicsObjects.forEach((item, i) => {
        if (item.x + item.width > leftmostVal){
            leftmostVal = item.x;
            leftmostObj = item;
        }
    });
    return leftmostObj;
}
```

As you can see, this is mostly a clone of `getRightmost`, but with one difference: the `if` statement is different. It checks if `item.x + item.width`, which is the furthest left side of the rectangle, as illustrated by the graphic (This is embedded SVG, which happens to be something I use on my webcomic a lot):
<svg version="1.1"
     width="100%" height="200"
     viewbox="0 0 100 100"
     xmlns="http://www.w3.org/2000/svg">
	<rect x="40" y="35" width="20" height="30" fill="red" />
	<rect x="59" y="37.5" width="2" height="25" fill="black" />
	<rect x="39" y="37.5" width="2" height="25" fill="yellow" />
	<text x="65" y="70" font-size="8">x + width</text>
	<text x="30" y="70" font-size="8">x</text>
</svg>

(Also, Typora, my WYSIWYG editor of choice, renders that SVG for me so I'm very happy writing this :smile:)

These functions allow us to, given a collisions list, determine which one should be used to set the X/Y positions of the object. Go into the `PhysicsObject` `loop` function and delete the `while` loops with `this.doCollision`. These are deprecated. Then, in `if (this.xv > 0)`, add `this.x = getRightmost(collX[1]).x - this.width;`. This is, as I've said many times, quite hairy, so let's disect it:

* `this.x = `: Set the X position of the player
* `getRightmost(collX[1])`: `collX[1]` is a list of things the object hit. This finds the rightmost thing the object hit.
* `.x - this.width;`: Subtract the current object's width from the x position of the rightmost brick. If we don't subtract `this.width` from it, the current object will be inside the brick; we want it to be outside and not touching.

Now, in `else if (this.xv < 0)` right after `if (this.xv > 0)`, add

```javascript
var leftmost = getLeftmost(collX[1]);
this.x = leftmost.x + leftmost.width;
```

Slightly more complex; but it does basically the same thing; in this case, however, it ignores the current physics object's `width` and instead uses the `leftmost` object's width. This means that it will go to the other side, but is otherwise the same. I encourage you to attempt to do the same thing on the Y side yourself, but if you can't here's the code for the Y side:

```javascript
if (collY[0]){
    if (this.yv > 0){ // Positive velocity = moving down
        this.touchingBottom = true;
        this.y = getTopmost(collY[1]).y - this.height;
        this.hitBottom();
    }
    else if (this.yv < 0){ // Negative velocity = moving up
        this.touchingTop = true;
        var bottommost = getBottommost(collY[1]);
        this.y = bottommost.y + bottommost.height;
        this.hitTop();
    }
    if (this.zeroOnHitY){
        this.yv = 0;
    }
}
```

And (unselectable) the full `PhysicsObject` `loop` function:

<pre class="noselect"><code class="language-javascript">loop(framesElapsed){
    if (!this.isStatic){
        this.touchingTop = false;
        this.touchingBottom = false;
        this.touchingLeft = false;
        this.touchingRight = false;
        this.xv *= Math.pow(this.friction * this.frictionChangeX, framesElapsed);
        this.yv *= Math.pow(this.frictionY, framesElapsed);
        this.frictionChangeX = 1;
        this.yv += (this.gravity * framesElapsed);
        this.move(this.xv * framesElapsed, 0);
        //this.x = Math.round(this.x);
        var collX = this.doCollision(this.game.checkCollision(this));
        if (collX[0]){
            if (this.xv > 0){ // Positive velocity = moving right
                this.touchingRight = true;
                this.x = getRightmost(collX[1]).x - this.width;
                this.hitRight();
            }
            else if (this.xv < 0){ // Negative velocity =  moving left
                this.touchingLeft = true;
                var leftmost = getLeftmost(collX[1]);
                this.x = leftmost.x + leftmost.width;
                this.hitLeft();
            }
            if (this.zeroOnHitX){
                this.xv = 0;
            }
        }
        this.move(0, this.yv * framesElapsed);
        var collY = this.doCollision(this.game.checkCollision(this));
        //this.y = Math.round(this.y);
        if (collY[0]){
            /*while (this.doCollision(this.game.checkCollision(this, collY[1]))[0]){
                this.move(0, -Math.abs(this.yv)/this.yv);
            }*/
            if (this.yv > 0){ // Positive velocity = moving down
                this.touchingBottom = true;
                this.y = getTopmost(collY[1]).y - this.height;
                this.hitBottom();
            }
            else if (this.yv < 0){ // Negative velocity = moving up
                this.touchingTop = true;
                var bottommost = getBottommost(collY[1]);
                this.y = bottommost.y + bottommost.height;
                this.hitTop();
            }
            if (this.zeroOnHitY){
                this.yv = 0;
            }
        }
    }
}</code></pre>

Now, when you reload, it should be-- exactly the same? That's because all we did was optimize. Now, it *can* perform better, but on most systems you won't notice the difference, especially with our time rate code.

## 6.2: Building a game interface

I'm going to recite the incantation: Anyone who's played Platformer before knows that there is a minimal (and still ugly, I haven't gotten around to improvements yet) game start, save, load, etc interface. However, these are advanced concepts, and I'm going to leave them for later (perhaps in this chapter, perhaps not). We need to start, after all, somewhere; and where to start but with actually building the interface? Begin with commenting out all of our game start code:

```javascript
/*
// Demo
var game = new Game(50, 50);

game.create(-5, 8, 20, 1, "normal", "solid");
game.create(-2, 4, 14, 1, "normal", "solid");
game.create(11, 3, 1, 1, "normal", "solid");
game.create(2, 3, 1, 1, "coin", "tencoin");
game.create(3, 3, 1, 1, "coin", "fiftycoin");
game.create(7, 7, 1, 1, "coin", "tencoin");
game.create(8, 7, 1, 1, "coin", "tencoin");
game.create(9, 7, 1, 1, "coin", "tencoin");

game.create(5, 0, 1, 1, "normal", "solid");
game.create(6, 0, 3, 1, "jumpthrough", "jumpthrough");
game.create(9, 0, 1, 1, "normal", "solid");
game.create(2, 0, 3, 1, "tar", "tar");

game.create(8, 6, 1, 1,  "lava", "killu", GunnerEnemy);


const FPS = 5;
const millisPerFrame = 1000 / FPS;
var lastFrameTime = 0;

window.onfocus = function(){
    lastFrameTime = window.performance.now();
}

function mainloop(){
    if (document.hasFocus()){
        var distTime = window.performance.now() - lastFrameTime;
        lastFrameTime = window.performance.now();
        var framesElapsed = distTime/millisPerFrame;
        game.loop(framesElapsed);
    }
    window.requestAnimationFrame(mainloop);
}
window.requestAnimationFrame(mainloop);
*/
```

Now it won't run, and when you reload you'll see nothing on-screen. This just gives us a clear workspace to do some HTML and CSS.

The technology we're going to use for the interface is called CSS grid. You should read about it on [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid)<collapsible-footnote citationname="[1]">You should also view the MDN article on grid areas <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas">here</a>.</collapsible-footnote> if you don't already understand it, we'll be doing complex stuff with it.
