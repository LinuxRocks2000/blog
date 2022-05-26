---
name: "Platformer From Scratch chapter 6"
bottomthing: "Conclusively finishing the physics engine for the third time, bats, level management"
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

## 6.2: Notice a bug?

Now that our physics engine is absolute and you can go down to ridiculously low time-rates (the timerate is set in the `const FPS`) without rounding errors - I've tried it as low as 0.5 - you've probably noticed that at lower time-rates the bullets from the gunner last much less time. This is because they count the number of real frames, not the number of animation frames: when the cpu is powerful enough, the code from Chapter 5 kicks in: if 200 milliseconds is more than enough time to process a frame, another frame will be processed. If you have a very slow computer, only 1 frame will be processed, if you have a very fast one, it will process many; an FPS counter is a project for chapter 7 that ought to be most rewarding. This means that when the bullet counts how long it has left, it's counting those extra partial frames, so it disappears much faster. Let's change this line in `FlyerEnemy`'s `loop` function:
```javascript
this.TTL -= 1;
```

Into:
```javascript
this.TTL -= framesElapsed;
```

This means that when a partial frame - decimal value of `framesElapsed` happens, it's counted as a partial frame instead of a full frame. `if (this.TTL == 0)` is also a bug: because of decimal framesElapsed values<collapsible-footnote citationname = "[1]">Every frame takes a different amount of time - oftentimes not noticeable. If there are 0.5 frames left and 1.2 frames pass (due to a system slowdown), it will become -0.7 instead of 0.</collapsible-footnote>, this will often not actually hit 0, and will be negative. Change it to `if (this.TTL <= 0)`, which will catch if it's less than as well as if it's equal to 0. Try running it at 5 fps timerate: they should last about the right amount of time, but they'll be created far too often, this is because of the same issue: it ticks down 1 for every extra frame it processes, instead of 0.1. Change this in the `GunnerEnemy` `loop` function: where there was `this.phase += 1;`, there should now be `this.phase += framesElapsed;`. If it's not already `if (this.phase >= 75)`, make it that way; `this.phase == 75` will trip the same issue. They should perform properly now.

## 6.3: Starting a game interface

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

The technology we're going to use for the interface is called CSS grid. You should read about it on [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid)<collapsible-footnote citationname="[2]">You should also view the MDN article on grid areas <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas">here</a>.</collapsible-footnote> if you don't already understand it, we'll be doing complex stuff with it. Let's add a grid container in `index.html` under `<div id="game">`:

```html
	</div><!-- the other html -->
	<div id="menu">
        <!-- we'll make this a grid container in CSS -->
	</div>
</div>
</body> <!-- placemarker -->
```

Now, in `main.css`, add a rule for the new `menu` div which sets `display` to `grid` like so:

```css
#menu {
    display: grid;
}
```

We want the menu to cover the whole page, so add some reset and cover properties like so:

```css
#menu {
    display: grid;
    width: 100vw; /* VW = % viewport width */
    height: 100vh; /* VH = % viewport height */
    position: absolute; /* Remove it from the document flow so it isn't messed up by the margins on other elements */
    top: 0px; /* position: absolute; doesn't take effect until we do this */
    left: 0px; /* Ditto */
    overflow: hidden; /* On some browsers, an element that perfectly fits the viewport will trip scrollbars; this prevents that. */
}
```

If you've never heard of them, read the MDN articles on [grids](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Grids) and [grid areas](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-area), I'm not going to post code snippets on key parts so you have no choice. Having thoroughly read and understood those MDN articles, set the `grid-area` under `#menu` to have `playbutton` and `levelname` portions - I'll let you set it up however you want. It is imperative for other actually provided code snippets that you set those up perfectly!

Now, add two new `div`s to the `menu` element, one with the id `playbutton` and one with the id `levelname`, like so:

```html
<div id="menu">
    <div id="levelname"></div>
    <div id="playbutton"></div>
</div>
```

And add CSS rules for them, like this:

```css
#levelname{
    fix-this: levelname;
}

#playbutton{
    fix-this: playbutton;
}
```

If you paid attention to the MDN articles, you'll see what's wrong with this. If you didn't, you should probably do that: I've been warning you that these chapters will get harder and you need to pay attention!

Now, we need to populate the `div`s with interface elements. Insert into the `<div id="playbutton">` a new `button`, like so:

```html
<div id="playbutton">
    <button>Play</button>
</div>
```

Assuming you did everything correctly, you should see a button labeled "play"... near the center of the screen<collapsible-footnote citationname="[3]">Assuming you set it up the way I did, with the play button in the bottom-right corner.</collapsible-footnote>? This is because the play `button` only takes up a small part of the `playbutton` div, you can fix this with `margin: auto;` in the `playbutton` CSS selector, which effectively tells it to assign margins as much and as equally as it can, shrinking the `playbutton` div around the button in the process. This should center it; the CSS for the entire menu should look about like this:

<pre class="noselect"><code class="language-css">#menu {
    display: grid;
    grid-template-areas: 'levelname   .'
                         '.           playbutton';
    width: 100vw; /* VW = % viewport width */
    height: 100vh; /* VH = % viewport height */
    position: absolute; /* Remove it from the document flow so it isn't messed up by the margins on other elements */
    top: 0px; /* position: absolute; doesn't take effect until we do this */
    left: 0px; /* Ditto */
    overflow: hidden; /* On some browsers, an element that perfectly fits the viewport will trip scrollbars; this prevents that. */
}



#levelname{
    grid-area: levelname;
    margin: auto; /* This wasn't added in the tutorial, but you should add it anyways. It will prevent later issues. */
}

#playbutton{
    grid-area: playbutton;
    margin: auto;
}
</code></pre>

Now, there isn't much we can do for `levelname` until we have level creation and launching set up. Play around with the CSS until you're happy - there are many great articles on button styling - and then continue on to the next section.

## 6.4: Level management

So far, our level has been static: it's only changeable after a reset. We're going to change that. First, uncomment the level create code, then create a new variable `const FirstLevel` on the global namespace (before the level creation code) like so:

```javascript
const FirstLevel = {
    create(game){
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
    },
    run(){ // We aren't using this yet

    },
    destroy(){ // Or this

    }
};
```

Now, run `FirstLevel.create(game);` after you create the game, your code should now look like:

```javascript
// const FirstLevel not shown.
var game = new Game(50, 50);

FirstLevel.create(game);

const FPS = 50; // If you haven't, you probably should set this to 50.
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
```

Run it and... exactly the same thing! You will also notice the play button hovering there - you probably should hide the `<div id="menu">` element by adding the property `style="display: none;"` inside the tag, like this:

```html
<div id="menu" style="display: none;">
    <div id="levelname"></div>
    <div id="playbutton">
        <button>Play</button>
    </div>
</div>
```

Now, when you run it, you see nothing different. Try restarting the level by running `FirstLevel.create(game)` in the developer console, however, and nothing happens! This is because the player is still being affected by gravity and, when we destroy the blocks, it keeps moving, *even though we can't see it*. Let's fix this with a new function on `Player` called `reset`, like so:

```javascript
reset(){
    this.x = this.game.startX;
    this.y = this.game.startY;
}
```

If you observe, you'll see that `this.game.startX` and `this.game.startY` don't exist. This is because, before, we've hard-coded the position of the player: on my local copy, the player starts at x 50, y 0. We need to change this. In the constructor of Game, add:

```javascript
this.startX = 50;
this.startY = 0;
```

And then, also in the `Game` constructor, change `this.player = new Player(this, 50, 0, this.blockWidth, this.blockHeight * 2);` to use `this.startX` and `this.startY`, like so:

```javascript
this.player = new Player(this, this.startX, this.startY, this.blockWidth, this.blockHeight * 2);
```

Now, try running `game.player.reset()` in the developer console. Because of our focus code, you won't see the player jerk into position immediately; you will only see that when you click inside the game area, focusing it. In any case, the player *will* jerk into position! Now, create a function under `Game` called `reset`, which calls `this.player.reset()`, like this:

```javascript
reset(){
    this.player.reset();
}
```

Now, call `game.reset()` in the `FirstLevel` `create` function, before all the create code. Figure it out if you don't know how! Once you get that working, try running then dying and calling `FirstLevel.create(game);` again in the developer console. It should work well enough, but you won't see the player! You need to add a graphics reset to the `Player` reset function, like this:

```javascript
reset(){
    this.x = this.game.startX;
    this.y = this.game.startY;
    this.element.style.display = ""; // Leaving it blank means it will go to the default, or what we set in main.css.
}
```

Now, it should work! Once you lose the game, the tileset is destroyed; level management allows you to arbitrarily create and re-create them. This all was, of course, only the precursor to building the actual level manager. You can start by creating a new class, `LevelManager`, and accepting one argument - `game` - in the constructor, then storing it as `this.game`, then storing a 0 to `this.levelNum` and `undefined` (nothin' yet) to `this.curLevel`. I hope you can figure it out, if you can't, scroll past the blankwall.

<div style="height: 100vh;"></div>

It should look like this:
```javascript
class LevelManager{
    constructor(game){
        this.game = game;
        this.levelNum = 0;
        this.curLevel = undefined;
    }
}
```

Make sure to be choosy about where in your code you put it! Rather like placing a sentence illogically on the SAT, your code quality (analogous to your test score) will take a hit. Of course, that doesn't matter as much as the next property we add to LevelManager in the constructor - `levels`, an array, like this: `this.levels = []`;. We also need a way to add levels to it, so let's create a function which takes an argument `level` and `push`es it into the `this.levels` array, like so:

```javascript
addLevel(level){
    this.levels.push(level);
}
```

Finally, we need a function that sets `this.curLevel` to the current level, advances levelNum (so next time it's called the cur level will be one ahead), and runs `this.curLevel.create()`. The `run` and `destroy` functions under `FirstLevel` will have to wait for another time; they will someday be used to add extra features. This function should be named `nextLevel` and should be under `class LevelManager`, and I highly recommend you try and figure it out yourself; if you can't, here's the code:

```javascript
nextLevel(){
    this.curLevel = this.levels[this.levelNum];
    this.curLevel.create(this.game);
    this.levelNum ++;
}
```

Now, implement this with `const levels = new LevelManager(game);` AFTER you define `game`. Delete the call to `FirstLevel.create()`, this can cause bugs later. Register FirstLevel with `levels.addLevel(FirstLevel)`, then run `levels.nextLevel();`. Your full demo code should now look like:

<pre class="noselect"><code class="language-javascript">var game = new Game(50, 50);
const levels = new LevelManager(game);
levels.addLevel(FirstLevel);
levels.nextLevel(); // Start it

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
</code></pre>

Run it and.... Nothing! This is because all we've done is wrap and complete things we already had, we're just making it cleaner and more extensible. Play around - maybe make another level? You can always go to the next level after dying with `levels.nextLevel();` in the console.

## 6.5: Back to the UI

Now that we have the level manager working, comment out the call to `levels.nextLevel` and delete the `display: none;` on `<div id="menu">` in index.html. Run it and... you'll see a player? This is because the game starts even before the `LevelManager` runs. We'll fix this more later on, but for now just comment all the demo code out. I expect that by now you've styled the button some more - I have a basic style set up if you want it:

```css
#playbutton > button{
    min-width: 100px;
    min-height: 50px;
    border-radius: 0px;
    text-decoration: none;
    border: none;
}
```

This is not the best way to do this. You need to mess a lot with the CSS for it to actually be beautiful; for now, you can just leave it the way it is. In chapter 7 I may go over making it more beautiful. Click the button, now, and... nothing? This is because we haven't yet made it trip a game start. Replace `<button>Play</button>` with `<button onclick = "levels.play()">Play</button>`. Re-load and click it - nothing! This is because we haven't defined `LevelManager`'s `play` function. Do that now - I'll let you figure it out - and add these lines of code in it:

```javascript
document.getElementById("menu").style.display = "none";
this.nextLevel();
```

The second line is fairly straightforward, so let's look at the first one, which is hairy:

* `document.getElementById("menu")`: Access an element with the `id` `menu`.
* `.style.display`: This corresponds to the CSS display attribute. It is a very powerful attribute, but the primary values that we see are "block" and "none". "none" just means "don't show it".
* ` = "none"`: Set it to "none".

It still won't work, however, because of another issue. We need to make `Game` wait till the level tells it to start, otherwise it'll just go ahead and play! Start by adding a new property `playing` to `Game`, in the constructor, like this: `this.playing = false;`, and in `Game`'s `loop` function, wrap everything in `if (this.playing){}`, like this (yes, it's noselected):

<pre class="noselect"><code class="language-javascript">loop(framesElapsed){
    if (this.playing){
        this.tileset.forEach((item, i) => {
            item.loop(framesElapsed);
            item.draw();
        });
        this.player.loop(framesElapsed);
        this.player.draw();
    }
}
</code></pre>
Now, in `Game.reset()`<collapsible-footnote citationname="[4]">Better get used to this notation. It just means the reset function in Game.</collapsible-footnote>, set `this.playing = true;`, and in `Game.die()`, set `this.playing = false;`. Now you can uncomment all that code, and it should- show a player? This is just graphics stuff, and we can fix it easily by removing the call to `this.draw()` in `Player`'s constructor.

Now, when you reload, you can play and die and everything! The only thing missing is the play button. Add this in `Game` `die`: `document.getElementById("menu").style.display = "";`. This just re-shows the game menu. Play it and die - it shows up! Unfortunately, there's a bug, when you click `Play` again it doesn't work. This is because it tries to play the next level, which doesn't exist; we can negate this by adding `levels.levelNum --;` (which just decreases the current level number by 1) in the `Game` `die` function. Note that this is NOT the best way to do this, it is simply the easiest to teach new coders; oftentimes, that is what I'll do in my beginner tutorial posts. Reload and play! You can play infinitely, and the player's score will save. Note that if you fall you have to re-load, this is because we don't have level-minima-is-death yet. Play around and make it your own, and see you in the next section, where we'll build ending blocks!

## 6.6: Ending Blocks

So far we have a level manager that can support multiple levels (you haven't tested it yet, most likely, but it will work), but we have no way to advance to the next level. Let's do that now by creating Ending blocks, which will have the same general effect as Death, but which will allow you to move on. First, of course, we need another map: I used

```javascript
const SecondLevel = {
    create(game){
        game.reset();
        game.create(-3, 3, 10, 1, "normal", "solid");
    }
};
```

And `levels.addLevel(SecondLevel);` (you can figure out where to put these two snippets). Now that that's out of the way, we can move on to creating a new block. In `FirstLevel` `create`, add `game.create(4, -1, 1, 1, "end", "end");`, and in `main.css`, add a new rule that sets the `background-color` of all elements with class `end` to `green` (if you can't figure it out, take inspiration from the CSS for `.tar` and `.ice`).

Now, when you reload, you should see a miraculous green block! Hit it and- you go through it. We haven't defined a new block in a long time, so here's the basic method:

1. Add the block create command (for testing)
2. Add the CSS for the block
3. Add the block to the `collisionsDict` in `Game` `checkCollision`

We've already done the first two, and you should know how to do the third by now, so I'll let you do that. Now, add `end` bricks to `specialCollisions` in `Player`'s constructor like so:

```javascript
this.specialCollisions.push("end");
```

And, finally, in `Player`'s `specialCollision` function, add a rule for `end` like so:

```javascript
if (type == "end"){
    this.game.win();
}
```

There's something wrong with this code. An observant coder will have noticed it by now; if you haven't, spend some time (2 minutes) debugging to figure it out. You know very well I'm about to give you the answer, but only after a wall. (Yes, D1, these are new, and yes, D1, they are for you).

<div class="timerwall" data-time="120"></div>

You need to define a `win` function under `Game` (if you didn't figure it out), and make it do essentially the same thing as `die`. Too keep things clean, let's move part of `die`'s code into a new function `clear` under game, and then call the same from `win`, like this:

```javascript
clear(){ // Clear the stuff from the level.
    this.tileset.forEach((item, index) => {
        item.remove();
    });
    this.tileset.splice(0, this.tileset.length);
    this.player.endGame();
    this.playing = false;
    document.getElementById("menu").style.display = "";
}

die(){
    this.clear();
    levels.levelNum --;
}

win(){
    alert("This was directly copied from PFS");
    this.clear(); // Note that this does nothing but clear the playspace - we'll add more later.
}
```

 Now, try reloading the game and hitting the end block. The game will clear as if you died, but click `Play`, and you'll advance to the next level! Notice that the player still has some velocity. It's optional to fix this, but you can by adding this to the `Player`'s `reset` function:

```javascript
this.xv = 0;
this.yv = 0;
```

This is completely optional. You can keep it the way it was if you like it- I did this just to make the thing more thorough. Yay, there's your ending block!

## 6.7: Improving the UI again

Winning and losing work, but unfortunately, there is no way to tell if you won or lost but going to the next level. Let's add a message saying `you lose` or `you win`! Start in `index.html`, adding two new `div`s below `<div id="menu">...stuff...</div>`. One of these `div`s should have the `id` "youlose" and the other "youwin", both should have the `class` `coverwall`. Fill their content with whatever you want; I'll give you what they look like after a 50-second timer-wall (I'm enjoying these far too much).

<div class="timerwall" data-time="50"></div>

(If those start getting too irritating to be educational, I'll make it so they only operate once then stay dead forever, even after reloads. Of course, I won't know about it, so that'll probably never happen.)

```html
<div id="menu">
    ...stuff...
</div>
<div id="youwin" class="coverwall">
    You win! <span style="font-size: 0.5em">This was copied directly from PFS.</span>
</div>
<div id="youlose" class="coverwall">
    You lose. <span style="font-size: 0.5em">This was copied directly from PFS.</span>
</div>
```

Now, we need to do some CSS. In `main.css`, add a rule for `coverwall`s: 

```css
.coverwall{
    width: 100vw; /* Cover the entire width and height */
    height: 100vh;
    position: absolute; /* Remove it from normal document flow and set it to the top-left corner */
    top: 0px;
    left: 0px;
    background-color: white; /* Set the background color to opaque white, the default is transparent */
    overflow: hidden; /* Elements with width 100vw or height 100vh may trip unnecessary scrollbars, this prevents that. */
}
```

When you reload, you should just see the words "you lose" on screen. This is because it's displaying the banners, even when we don't want them to! Fix this by adding `style="display: none;"` to both of the coverwall divs (this is fairly easy to do: it's the same syntax as adding an id, so I'm not going to show it here). Now, when you reload, it should look normal; we need to start using these little guys. Create a function under `Game` called `doShowThing`. It should take one argument: `element`. Since it's complicated, I won't force you to figure it out yourself; it should look like this:

```javascript
doShowThing(element){
    element.style.display = ""; // Show the element by resetting display (we've seen this before!)
    setTimeout(() => {
        element.style.display = "none"; // Hide the element by setting display to none (we've seen this before as well!)
    }, 2000);
}
```

Whoa- what? That's hairy. You can kinda see an arrow function in there, like a forEach one, but what's `setTimeout`? `setTimeout` is a function defined by the browser that waits a certain number of *milliseconds*<collapsible-footnote citationname = "[5]">Milliseconds are 1/1000s of a second, so it takes a thousand milliseconds to make a single second.</collapsible-footnote> to run a function. We pass an arrow function in, one which hides an element, and then we have `, 2000`. The `,` means it's the next argument, and `2000` is a number in milliseconds: 2 seconds. 

Now, in `Game`'s `die` function, simply add `this.doShowThing(document.getElementById("youlose"));`  This is hairy, so let's walk through it:

* `this.doShowThing(`: This is the function we just defined. It is called with arguments, hence the parens.
* `document.getElementById`: We've seen this before. Get an element from the page by it's `id`.
* `"youlose"`: This is the ID of the div with the "you lose" stuff.
* `);`: End calling the function.

Try dying, and you'll find that it works! You see a simple `you lose` text. Now, let's effectively duplicate this; call the function the same way in `Game.win`, but with `youwin` instead of `youlose`. This should now work for winning as well as losing!

One thing you'll notice is that these are *ugly*. Tiny font, not centered, none of the things we get in Platformer. I won't have a huge tutorial on making them beautiful here - this chapter is already running extremely long - but you can definitely add `font-size: 2em;` in the CSS for them. If you can't find that CSS, you haven't been paying very good attention. I'm not going to bother about beautifying them as I intend to redo the interface later on (my plan is to replace the current Platformer with this).

## 6.8: Where am I? Adding a level name and number count.

Right now, a large portion of our CSS grid is unused, but now that we've implemented levels almost fully, let's start with it. In `LevelManager`, create a new function `updateLevelname`. In it, grab the element with id `levelname` and set it's `innerText` to `this.levelNum`. I said these chapters are getting harder, so figure it out; the code is available under another cruel wall - this one for 3 minutes.

<div class="timerwall" data-time="180"></div>

I hope you figured it out- if you did, check it against this; I've noselected this one so you can't just use it.

<pre class="noselect"><code class="language-javascript">updateLevelName(){
    document.getElementById("levelname").innerText = this.levelNum;
}
</code>
</pre>

Now, in `LevelManager`'s constructor, add a call to `this.updateLevelName()`. This means it'll start off that way, and then in `LevelManager`'s `nextLevel` function, add another call the same way. Every time it advances a level, the text will update! If you implemented this properly, it should work. I'm not adding level name functionality because that would take a lot of time, but I recommend you try it! Yay, it works.

## 6.9: Bats! Finally, bats!

There's a reason Bats have been delayed so far: they're extremely difficult. The little buggers have to wait until they see a player, which means line-of-sight checking, which means a lot of complex code. Let's get started!

The first thing we need is the line-of-sight check. This draws an imaginary line between bat and player and detects if it hits any blocks: if the line of sight hits blocks, the bat can't see it, otherwise the bat can see it. This isn't particularly efficient - there are false negatives - but it's much easier than true sight checking.

(This algorithm provided helpfully by SO user "user37968", in their answer [here](https://stackoverflow.com/a/293052).)

Create a global function like `getTopmost` called `pointRelationToLine`, like this (I'll give it to you easy because I don't fully understand it either):

```javascript
function pointRelationToLine(x, y, line){
    var val = ((line[3] - line[1]) * x) + ((line[0] - line[2]) * y) + ((line[2] * line[1]) - (line[0] * line[3]));
    return val == 0 ? 0 : val/abs(val); // Find the sign and avoid divide by 0 issues.
} // This returns -1 if the point (x, y) is above the line, 1 if it's below, and equal to 0 if it's on the line.
```

Now create a function `isRectOffLine` (which just tests if a rectangle is definitely *not* on a line), like so:

```javascript
function isRectOffLine(rect, line){
    var p1Val = pointRelationToLine(rect[0], rect[1], line);
    var p2Val = pointRelationToLine(rect[2], rect[3], line);
    var p3Val = pointRelationToLine(rect[0], rect[3], line);
    var p4Val = pointRelationToLine(rect[2], rect[1], line);
    return p1Val == p2Val && p2Val == p3Val && p3Val == p4Val;
}
```

Again, you get this free because it's complicated to the point that I barely understand it.

I'm not totally evil, so I'll also let you have the much simpler one that I understand, the one that detects if the line is to the sides of the rectangle:

```javascript
function isLineOffRect(rect, line){
    return (line[0] < rect[0] && line[2] < rect[0]) ||
           (line[0] > rect[2] && line[2] > rect[2]) ||
           (line[1] < rect[1] && line[3] < rect[1]) ||
           (line[1] > rect[3] && line[3] > rect[3])
}
```

And then, if you want to check if any rectangle `rect` is definitely NOT on a line, you use `!isRectOffLine(rect, line) && !isLineOffRect(rect, line)`. The logic of this is breathtakingly broken, and I'm sure the solution will come to me when I'm less sleepy (it is late as I write this), but for now that's just the sad truth. Now, we need to actually use these functions: create a new `BatEnemy` class, the same way other enemy classes are created, and in the loop function add a `forEach` over `this.game.tileset`. For every block in the tileset, check if the block is not viewing it; if the block is not, you should set a boolean `canSee` to false (define canSee as default true at the top of the function). You can get the compatible rectangle of any block with `var rect = [item.x, item.y, item.x + item.width, item.y + item.height];`, and the line between the rectangle and player with `var lineToPlayer = [this.game.player.x, this.game.player.y, this.x, this.y];`. Finally, using `canSee`, at the bottom of the code (after the forEach), add:

```javascript
if (canSee){
	this.element.style.backgroundColor = "red";
}
else{
    this.element.style.backgroundColor = "blue";
}
```

Create a new Bat by replacing the `GunnerEnemy`'s create function, like `game.create(8, 6, 1, 1,  "lava", "killu", BatEnemy);` (where the old command `game.create(8, 6, 1, 1,  "lava", "killu", GunnerEnemy);` was, in FirstLevel), and run it: the bat should turn red when it can see you, and stay blue otherwise. If this doesn't work, you can view the fully functional code under a 3-minute wall.

<div class="timerwall" data-time="180"></div>

<pre class="noselect"><code class="language-javascript">class BatEnemy extends Brick{
    constructor(game, x, y, width, height, style, type){
        super(game, x, y, width, height, style, type);
        this.state = 0;
        this.isStatic = true;
    }

    loop(framesElapsed){
        super.loop(framesElapsed);
        var lineToPlayer = [this.game.player.x, this.game.player.y, this.x, this.y];
        var canSee = true;
        this.game.tileset.forEach((item, i) => {
            var rect = [item.x, item.y, item.x + item.width, item.y + item.height];
            if (!isRectOffLine(rect, lineToPlayer) && !isLineOffRect(rect, lineToPlayer) && item != this){
                canSee = false;
            }
        });
        if (this.state == 0){
            if (canSee){
                this.state = 1;
                this.isStatic = false;
            }
        }
    }
}</code></pre>

(I'm going to assume you did the create command correctly).

Now, we need to start tracking the state of the bat. Store a variable `state` to the object in the constructor, like `this.state = 0;`. We want them to do nothing but hover there until they see a player, so let's set `this.isStatic` to `true` in the constructor. Now, in the `loop` function, delete all the color-changing stuff and instead do

```javascript
if (this.state == 0){
    if (canSee){
        this.state = 1;
        this.isStatic = false;
    }
}
```

This bumps up `this.state` to 1 in the case that it can both see the player AND the state is 0, and frees the object to fall. Try it out, it should behave as expected, waiting until it can see the player then falling. Now, we can use the `hitBottom` function we set up in an earlier chapter (I forget which, wasn't it 3?): if state is 1 and it hits bottom, state goes to 2, and sets all the physics presets to match Flyer. I'll let you figure it out, or just scroll past a normal blankwall.

<div style="height: 100vh;"></div>

```javascript
// this goes in BatEnemy
hitBottom(){
    if (this.state == 1){
        this.state = 2;
        this.gravity = 0;
        this.friction = 0.9;
        this.frictionY = 0.9;
    }
}
```

(Note: if you don't die when you hit the bat, it's because of a discrepancy in your BatEnemy class. Do view my noselected things!)

Now, in `Bat`'s `loop` function, add an if statement for if `this.state == 2`, and copy the FlyerEnemy chase code (ignore the TTL stuff) to it. The Bat class should now look like this:

<pre class="noselect"><code class="language-javascript">class BatEnemy extends Brick{
    constructor(game, x, y, width, height, style, type){
        super(game, x, y, width, height, style, type);
        this.state = 0;
        this.isStatic = true;
    }

    loop(framesElapsed){
        super.loop(framesElapsed);
        var lineToPlayer = [this.game.player.x, this.game.player.y, this.x, this.y];
        var canSee = true;
        this.game.tileset.forEach((item, i) => {
            var rect = [item.x, item.y, item.x + item.width, item.y + item.height];
            if (!isRectOffLine(rect, lineToPlayer) && !isLineOffRect(rect, lineToPlayer) && item != this){
                canSee = false;
            }
        });
        if (this.state == 0){
            if (canSee){
                this.state = 1;
                this.isStatic = false;
            }
        }
        if (this.state == 2){
            if (this.game.player.x > this.x){ // If the player is behind the enemy, move backwards
                this.xv += framesElapsed;
            }
            else if (this.game.player.x < this.x){ // Else if only runs if the last if statement didn't run (like else), but also checks for conditions, hence the name.
                this.xv -= framesElapsed;
            }
            if (this.game.player.y > this.y){ // If the player is further down than the enemy, move down.
                this.yv += framesElapsed;
            }
            else if (this.game.player.y < this.y){ // The reverse.
                this.yv -= framesElapsed;
            }
        }
    }
    
    hitBottom(){
        if (this.state == 1){
            this.state = 2;
            this.gravity = 0;
            this.friction = 0.9;
            this.frictionY = 0.9;
        }
    }
}</code></pre>

Play with it some more - it should chase you around and everything, as it was designed to do. See you in the next chapter!

## 6.10: Wrapping Up

Well, this was a long chapter. Really long. 6500 words. It took me a couple weeks to write - I was lacking in motivation for most of them - but it was very rewarding; we got bats and levels and stuff. I don't have any plans for chapter 7, except for making the interface nicer, if you have any ideas do E-mail me (I probably won't respond or even receive the e-mail, but it's worth a shot). None of my other posts will be truly PFS, they will all be spin-offs. This tutorial was meant to take you from no knowledge whatsoever to building a basic video game, and you've done it! You can make maps, you can build enemies, and you can put up with my insatiable urge to develop new CSS and JS to annoy your tutorial experience. I'm very glad that this tutorial worked out as well as it did, and I hope you all know a little bit more about code than you did when you started.

See you again soon, Tyler.
