---
name: "Platformer From Scratch chapter 5"
bottomthing: "Cleaning up motion, adding fifty coins, adding various other new block types"
---

Hello again, young coder knights-errant! Our platformer game is almost finished, and though there will likely be more PFS-related posts after chapter 6, they won't be part of Platformer from Scratch official. I'll miss writing this series!

### 5.1: Motion fixes

I didn't originally intend to write on this at all, but one of you PFS readers showed me that the demo pages are too optimized and fast to actually play on some systems, so in this section we'll go over optimizing motion. Basically, motion optimization is the process of changing how fast things move based on how much time has elapsed since the last frame; there's a different formula for each part of motion (it took a while to minutes to figure them all out), the starting part is when we call the `this.move` commands. However, determining the number of frames that have elapsed is not a simple function call! We need to track the time (in milliseconds) since the last frame, then use subtraction on current time to determine time elapsed, then save the current time as last frame time, then use math to determine how many frames have passed at the framerate. The first thing we should do is thus establish a framerate and the number of milliseconds per frame:

```javascript
const framerate = 60; // 60 frames per second
const millisPerFrame = 1000/framerate; // 1000 milliseconds = 1 second
```

If this seems confusing, don't worry, it'll get clearer as we progress. Now we must save a variable as the millisecond of the last frame:

```javascript
var lastFrameTime = window.performance.now(); // window.performance.now() returns the current millisecond
```

And change our gameloop code like so:

```javascript
function mainloop(){
    var distTime = window.performance.now() - lastFrameTime; // Time since last frame
    lastFrameTime = window.performance.now(); // Reset last frame time to now
    var framesElapsed = distTime/millisPerFrame; // Determine number of frames to pass during that time
    game.loop(framesElapsed); // We'll change the game.loop function to support this in a second.
    window.requestAnimationFrame(mainloop);
}
window.requestAnimationFrame(mainloop);
```

Now, we must change `Game`'s `loop` function to accept a value in time since last frame:

```javascript
loop(framesElapsed){
    this.tileset.forEach((item, i) => {
        item.loop(framesElapsed);
        item.draw();
    });
    this.player.loop(framesElapsed);
    this.player.draw();
}
```

This really just passes a value to players and bricks, not much else. Let's change the `loop` code in PhysicsObject to make it more supportive of `framesElapsed`, simply with multiplication, like this:

```javascript
... // other code
this.move(this.xv * framesElapsed, 0);
... // More other code
this.move(this.yv * framesElapsed, 0);
```

Pretty simple. If the system is slow and two frames have gone by, multiply xv and yv by 2 so it's chunkier but faster; if the system is fast and 0.5 frames have gone by, only do half of xv and yv in a frame. We can't, however, run it yet; we still have to change our override code in `Player` `loop` like so:

```javascript
loop(framesElapsed){
    super.loop(framesElapsed);
    if (this.keysHeld["ArrowUp"]){
        this.Jump();
    }
    if (this.keysHeld["ArrowLeft"]){
        this.Left(framesElapsed); // This new framesElapsed being passed is used later
    }
    if (this.keysHeld["ArrowRight"]){
        this.Right(framesElapsed);
    }
}
```

Simple. Now run it and it should feel pretty natural, but if you change the framerate strange things will happen. For low framerates, say, `20` fps the animation feels pretty smooth, but all your speeds are reduced: you now can barely jump and motion is sluggish. This is because many cycles of gravity and friction, not just one, are running, so it gets much harder to play. Let's fix this in `PhysicsObject`'s `loop` where gravity and friction apply, this reduces them to change only a fraction of what they normally should:

```javascript
... // Code code code.
this.xv *= Math.pow(this.friction, framesElapsed);
this.yv += (this.gravity * framesElapsed);
```

Feels much better now; very slow, but very smooth too. You'll also find that you, while being unable to jump high, can drift over the entire map very easily with a single jump! This is because, on every cycle, xv is being incremented in the `Left` and `Right` commands, but only a single effective cycle of friction is applied. Let's change up our player `Left` and `Right` functions, like so:

```javascript
Left(framesElapsed){
    this.xv -= 3 * framesElapsed; // If we only compute a small amount of a frame every cycle, which happens for 20 fps, this will be a much smaller fraction. The end result is 3 pixels per true frame.
}

Right(framesElapsed){
    this.xv += 3 * framesElapsed;
}
```

Much better! However, you'll probably notice some jittering when the lava and when you touch the ground. This is because the collision rebound uses whole numbers, but your x and y are fractional; we can fix this with well-applied rounding right before the rebound code, with `this.y = Math.round(this.y);` and `this.x = Math.round(this.x);`, right after the respective move commands in `loop`. If it doesn't work, here's the full loop command (and of course, I disabled copy/paste):

<pre class="noselect">
    <code class="language-javascript">loop(framesElapsed){
    if (!this.isStatic){
        this.touchingTop = false;
        this.touchingBottom = false;
        this.touchingLeft = false;
        this.touchingRight = false;
        this.xv *= Math.pow(this.friction, framesElapsed);
        this.yv += (this.gravity * framesElapsed);
        this.move(this.xv * framesElapsed, 0);
        this.x = Math.round(this.x);
        var collX = this.doCollision(this.game.checkCollision(this));
        if (collX[0]){
            while (this.doCollision(this.game.checkCollision(this, collX[1]))[0]){
                this.move(-Math.abs(this.xv)/this.xv, 0);
            }
            if (this.xv > 0){ // Positive velocity = moving right
                this.touchingRight = true;
                this.hitRight();
            }
            else if (this.xv < 0){ // Negative velocity =  moving left
                this.touchingLeft = true;
                this.hitLeft();
            }
            if (this.zeroOnHitX){
                this.xv = 0;
            }
        }
        this.move(0, this.yv * framesElapsed);
        var collY = this.doCollision(this.game.checkCollision(this));
        this.y = Math.round(this.y);
        if (collY[0]){
            while (this.doCollision(this.game.checkCollision(this, collY[1]))[0]){
                this.move(0, -Math.abs(this.yv)/this.yv);
            }
            if (this.yv > 0){ // Positive velocity = moving down
                this.touchingBottom = true;
                this.hitBottom();
            }
            else if (this.yv < 0){ // Negative velocity = moving up
                this.touchingTop = true;
                this.hitTop();
            }
            if (this.zeroOnHitY){
                this.yv = 0;
            }
        }
    }
}
    </code>
</pre>

Now, it should be pretty smooth and realistic for most framerates you choose; remember that the framerate you set in the code is just a scale. It defines how many milliseconds it takes for each full motion to happen. The actual framerate will likely be much higher; a good browser could simulate hundreds of frames per second but it will always move at the same speed. I use 50 simulated FPS for mine, as the original Platformer was 50 fps and it feels about right, but it's your choice; it doesn't make it any less or more smooth until you get to such high framerates that the browser has to start lagging frames to do computation. When this happens, the doubled XV and YV will potentially start being enough to pass through objects, so take care! Players of the original platformer will hopefully find this new code quite a relief as platformer is/was subject to periodic slowdowns (it is my plan to replace original platformer with PFS platformer, so it probably doesn't do that anymore).

### 5.2: Coin animation

Yay, now that the boring part is over we can make coins fun! This is something that CSS can handle entirely and can handle well because it's largely hardware accelerated, let's take full advantage. Start by putting this at the top of the file:

```css
@keyframes spin {
    0%{
        transform: perspective(300px) rotateY(0deg);
    }

    100%{
        transform: perspective(300px) rotateY(360deg);
    }
}
```

`@keyframes` defines a set of frames for animation, the browser computes the rest. I won't go in-depth here, but basically `perspective(300px)` allows 3D transforms on the coin, and `rotateY` does a spin on the Y axis.

Now, change the .coin selector like so:

```css
.coin{
    background-color: yellow;
    border-radius: 100%;
    animation-name: spin;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-direction: normal;
    animation-timing-function: linear;
}
```

Let's walk through this step by step.

* `animation-name`: Determines the name of the animation, created with `@keyframes` above
* `animation-duration`: Amount of time it takes for the animation to go from `0%` to `100%`.
* `animation-iteration-count`: Number of times the animation repeats
* `animation-direction: normal;`: Tells it to animate in the same direction continuously, instead of going backwards when it hits the peak (this may be a default, but I prefer to explicitly specify it)
* `animation-timing-function`: The way it splits time between phases of the animation. It can be linear or various functions, I use `linear` so it looks like the coin is rotating at a constant speed. Yay, now the coin rotates!

### 5.3: The slowdown bug

In modern browsers, Javascript in unfocused tabs is slowed down or stopped. This is designed to save resources and does a good job, but it doesn't stop updating `window.performance.now()`, so you can revisit a browser tab and when the JS starts firing it will find that it is many seconds in the future. This can be thousands of frames, so xv and yv will be multiplied thousands of times - it will pass right through the tileset. We can fix this by using the `window.onfocus` callback to determine when it gains focus and resetting the last frame time when that happens, thus keeping it from breaking:

```javascript
window.onfocus = function(){
    lastFrameTime = window.performance.now();
}
```

You can now run it and exit the tab for about 30 seconds, and go back into the tab - if you're on Firefox, like me, there's a fair chance the enemy and tileset has disappeared. This is because it *slows down*, not *stops* the Javascript, some overly-spaced frames are still being rendered. We need another check! Wrap everything but `window.requestAnimationFrame` in an if statement like so:

```javascript
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

`document.hasFocus()` just checks if it has focus, as the name says; if you don't have focus it shouldn't run. Try again- this time, it should work!

### 5.4:  50 coins and better coin styling

Anybody who's actually played platformer knows that 10 coins render smaller than 50s. But how can we do that ourselves? The trick is by editing our CSS a bit to make the `span` inside the coin element the only part with graphics:

```css
.coin{
    animation-name: spin;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-direction: normal;
    animation-timing-function: linear;
}

.coin > span{
    background-color: yellow;
    border-radius: 100%;
    display: inline-block;
    position: relative; /* Relative is easier to read than absolute in this case - it should be placed *relative* to the outer brick */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

Now, when you start it, it looks a lot smaller. Too small. Let's add some `padding` to make it better:

```css
.coin > span{
    background-color: yellow;
    border-radius: 100%;
    padding: 5px;
    display: inline-block;
    position: relative; /* Relative is easier to read than absolute in this case - it should be placed *relative* to the outer brick */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

It should look much better now; let's add fifties!

First, go into the `Brick` constructor and, in front of the `if (type == "tencoin")` statement, add an `if (type == "fiftycoin")`, which does the same thing but with `50` instead of `10`. I'll let you figure it out (you can view the code for this chapter linked below if you really must). Change `tencoin` to `fiftycoin` down in the test level declaration and reload the page. You'll immediately notice something amiss: it's the same size as a ten coin! We need to add two new rules in the CSS for `.fiftycoin > span` and `.tencoin > span`. First, move the `padding: 5px;` from `.coin > span` to `.tencoin > span`, so you only do that for tencoins, and then in the `.fiftycoin > span` rule add `padding: 10px;`. Your end result css should look like this:

```css
.coin > span{
    background-color: yellow;
    border-radius: 100%;
    display: inline-block;
    position: relative; /* Relative is easier to read than absolute in this case - it should be placed *relative* to the outer brick */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.tencoin > span{
    padding: 5px;
}

.fiftycoin > span{
    padding: 10px;
}
```

Create a tencoin for comparison, put it next to the fifty coin (if you can't do that, you have not paid attention to anything in this entire series). Your test level is now:

```javascript
game.create(-2, 4, 14, 1, "normal", "solid");
game.create(-2, 3, 1, 1, "normal", "solid");
game.create(4, 3, 1, 1, "normal", "solid");
game.create(11, 3, 1, 1, "normal", "solid");
game.create(2, 3, 1, 1, "coin", "tencoin");
game.create(3, 3, 1, 1, "coin", "fiftycoin");
game.create(8, 2, 1, 1,  "lava", "killu", NormalEnemy);
```

Now try to collect the 50 coin and... the game hangs! We fixed this issue for both tencoin and killu, so you can should take a try to fix it yourself, scroll past the blank wall if you don't want to.

<div style="height: 100vh;">

</div>

Ok, you first need to revise the collisions dict in `checkCollision` with a new `fiftycoin` rule:

```javascript
var collisionsDict = {
    "solid": [0, []], // Remember the word "solid" from when you created a brick? This references that!
    "allBricks": [0, []], // Each entry stores an array containing a number (the number of things in it) and another array, the things themselves.
    "allPlayers": [0, []], // Every player in the collision. Above is every block.
    "all": [0, []], // Everything
    "killu": [0, []], // The type is "killu". I know, I know. I wrote this when I was 12 and wasn't motivated enough to change the names.
    "tencoin": [0, []],
    "fiftycoin": [0, []]
}
```

To actually collect it, you need to register it as a special collision for players in the `Player` constructor by putting `this.specialCollisions.push("fiftycoin");` in front of the equivalent command for `tencoin`, then in the `Player` `specialCollision` function copy/paste the code for tencoin collisions and change the numbers and names, like so:

```javascript
if (type == "fiftycoin"){
    items.forEach((item, index) => {
        this.game.deleteBrick(item);
        this.score += 50;
    });
}
```

Now, when you hit the fifty coin, you gain 50 points!

### 5.5: Jumpthroughs

Jump-through platforms are more complicated than normal platforms and require some revisions to our `doCollision` code in `PhysicsObject`:

```javascript
doCollision(coll){
    var returner = [false, []];
    this.collisions.forEach((item, i) => {
        if (coll[item][0] > 0){
            returner[0] = true;
            returner[1].push(...coll[item][1]); // This is unpacking magic.
        }
    });
    this.specialCollisions.forEach((item, index) => {
        if (coll[item][0] > 0){
            if (this.specialCollision(item, coll[item][1])){ // Now, check if specialCollision returns true: if it does, do an actual collision with the item
                returner[0] = true;
                returner[1].push(...coll[item][1]);
            }
        }
        else{
            this.noSpecial(item); // Run a function callback for when there were no collisions with that type.
        }
    });
    return returner;
}
```

This now allows you to return `true` from `specialCollision` for actual collisions, and allows you to run a function every time a special collision does *not* happen. Down below, we've also defined a new empty function: 

```javascript
noSpecial(type){

}
```

Now, we should add a test `jumpthrough` block. I used `game.create(3, 0, 3, 1, "jumpthrough", "jumpthrough");` for the create code; nothing will show up until you add CSS like so:

```css
.jumpthrough{
    background-color: yellow;
}
```

This shouldn't be complex at all, it's just another style rule for a block type. Now, when you reload, you should see a yellow jumpthrough! Try touching it and the game crashes; you can fix this bug pretty easily if you remember how. If you don't, read the previous chapters.

Now that that's fixed, add `jumpthrough` as a special collision type in the `Player` constructor like so: `this.specialCollisions.push("jumpthrough");`, and store a variable `jumpthroughing` to `false` right above it: `this.jumpthroughing = false;`. This covers the tedious bit.

Now, in `specialCollision`, add an `if (type == "jumpthrough")` and populate like this:

```javascript
if (type == "jumpthrough"){
    if (this.yv <= 0){ // It's moving up
        this.jumpthroughing = true;
    }
    else{
        if (!this.jumpthroughing){
            return true;
        }
    }
}
```

This is pretty simple, it just checks if it's hitting a jump-through platform and `yv` is less or equal to than zero (player is traveling upwards or not moving at all), then sets `jumpthroughing` to true. If yv is *not* less than or equal to 0, conveyed through the `else` statement<collapsible-footnote citationname = "[1]">"Else" is just like "if" but doesn't take any parameters, it simply runs if the last "if" statement doesn't. This adds an easy and efficient "not" case to things.</collapsible-footnote> If we aren't jumpthroughing, it's touching a jumpthrough brick, and the yv is not less than 0, it's probably hitting the top of the jumpthrough and should be considered a collision, hence `return true`. We've already talked about `undefined` being equivalent to `false`, and in this case `undefined` is the default return of a function, so there's no collision if we don't say there is. Try it out - once you hit the block with negative yv, it stops being tangible. Now we can use the `noSpecial` function:

```javascript
noSpecial(type){
    if (type == "jumpthrough"){
        this.jumpthroughing = false;
    }
}
```

Basically, if it's *not* touching a jumpthrough platform, it can't physically be jumpthroughing and sets jumpthroughing to false. Thus, you can jump up through a jumpthrough, then it becomes solid when you hit it. This is a pretty simple trick of logic that makes a complex feature work well! Try hitting the sides, if you hit them with negative yv (moving upwards) the jumpthrough will go intangible. If you don't reach out of the jumpthrough in a single hop, you will smoothly fall back through, ready to try again.

Jumpthrough usage note: You should almost always have two blocks on either side of the jumpthrough just to make it so people can't glide through the sides. Gliding through the sides doesn't break anything, per se, it just doesn't look nice.

### 5.6: Flyers

Flyers are the most irritating type of enemy in the game. They always move towards you and never die (In platformer official, there are bombs that kill flyers; you can add these yourself or follow a later tutorial assuming I make one), and can fly at high speeds. Sound interesting?

Let's add a new feature to PhysicsObject in the constructor: `frictionY`. Default it to 1 (no change), and implement it the same way as x friction is: you can even copy/paste the code and change the numbers. Here's the new constructor and loop codes (with most of it stripped out for code readableness):

```javascript
constructor(game, x, y, width, height, isStatic){
    this.game = game;
    ... //code code code
    this.friction = 0.8;
    this.frictionY = 1;
    ... //more code
}

loop(framesElapsed){
    if (!this.isStatic){
        this.touchingTop = false;
        this.touchingBottom = false;
        this.touchingLeft = false;
        this.touchingRight = false;
        this.xv *= Math.pow(this.friction, framesElapsed);
        this.yv *= Math.pow(this.frictionY, framesElapsed); // This is the important part
        this.yv += (this.gravity * framesElapsed);
        ... // lots of code code code
    }
}
```

This doesn't impact the player because the player's `frictionY` is at default, 1, and 1 to any power *x* is always 1. This is a complex piece of algebra that is beyond the scope of this post to explain, unfortunately, but it does mean we don't have to do any configuration systems.

Now, you can create a new Special brick class, the same way we made NormalEnemy, but this time called `FlyerEnemy`. The constructor should be empty (don't forget to feed the `super`, though, you can look at how we did it in the NormalEnemy code if you must), and it should extend the `loop` function the same way `Player` does (but leave it empty except feeding the super, this time):

```javascript
class FlyerEnemy extends Brick{
    constructor(game, x, y, width, height, style, type, config){
        super(game, x, y, width, height, style, type);
    }

    loop(framesElapsed){
        super.loop(framesElapsed);
    }
}
```

Now, we need to make it fly instead of crawl. First, set `this.gravity = 0;` in the constructor. You can actually ignore this if you want to, but it'll look a little strange. I recommend setting it somewhere between `0` and `0.5` for convincing flight gravity without affecting physics. (Yes, negative gravity works). Next, add `this.frictionY = 0.8;`, so it experiences y velocity friction, and `this.isStatic = false;`, so it runs physics. Then, add this to `loop`:

```javascript
if (this.game.player.x > this.x){ // If the player is behind the enemy, move backwards
    this.xv ++;
}
else if (this.game.player.x < this.x){ // Else if only runs if the last if statement didn't run (like else), but also checks for conditions, hence the name.
    this.xv --;
}
if (this.game.player.y > this.y){ // If the player is further down than the enemy, move down.
    this.yv ++;
}
else if (this.game.player.y < this.y){ // The reverse.
    this.yv --;
}
```

Replace the original enemy with the new flyer, so your level code should look like this:

```javascript
var game = new Game(50, 50);

game.create(-2, 4, 14, 1, "normal", "solid");
game.create(-2, 3, 1, 1, "normal", "solid");
game.create(4, 3, 1, 1, "normal", "solid");
game.create(11, 3, 1, 1, "normal", "solid");
game.create(2, 3, 1, 1, "coin", "tencoin");
game.create(3, 3, 1, 1, "coin", "fiftycoin");
game.create(8, 2, 1, 1,  "lava", "killu", FlyerEnemy);

game.create(3, 0, 3, 1, "jumpthrough", "jumpthrough");
```

Now reload. The thing follows you! If you're lucky enough to dodge it and get to the jumpthrough, you'll notice the enemy doesn't collide with it. Let's fix that by adding `jumpthrough` to the true collisions set for flyers: `this.collisions.push("jumpthrough");` (in the constructor). Now, reload and test again; if you're very good at the game, you can get the flyer trapped on the other side of the jumpthrough from you. It works! You can leave it the way it is right now, but I changed `friction` and `frictionY` both to `0.9`. Remember to set `friction` in the constructor of `FlyerEnemy`, not `PhysicsObject`, if you do that! Editing defaults is a bad idea.

One thing you've probably noticed is that the player doesn't jump very high. I upped the jump speed to 22 in `Player` `Jump`, but you don't have to. I changed up the test level for flyer dogfighting, here it is:

```javascript
game.create(-5, 8, 20, 1, "normal", "solid");
game.create(-2, 4, 14, 1, "normal", "solid");
game.create(11, 3, 1, 1, "normal", "solid");
game.create(2, 3, 1, 1, "coin", "tencoin");
game.create(3, 3, 1, 1, "coin", "fiftycoin");
game.create(7, 7, 1, 1, "coin", "tencoin");
game.create(8, 7, 1, 1, "coin", "tencoin");
game.create(9, 7, 1, 1, "coin", "tencoin");
game.create(8, 6, 1, 1,  "lava", "killu", FlyerEnemy);

game.create(4, 0, 1, 1, "normal", "solid");
game.create(5, 0, 3, 1, "jumpthrough", "jumpthrough");
game.create(8, 0, 1, 1, "normal", "solid");
```

### 5.7: Ice and Tar

Now we need to add one more feature to PhysicsObject: `frictionChange`X. It should be 1, and defined in the constructor, like so: `this.frictionChangeX = 1;`. Now, in the physics code, multiply friction and by frictionChangeX when they're applied, like this:

```javascript
this.xv *= Math.pow(this.friction * this.frictionChangeX, framesElapsed);
```

Finally, create a new brick type "ice" (in the CSS, use `lightblue` as the background-color, and use the well-referenced fix to make it work with the physics engine). Register it as a special collision on `Player` (As an exercise, you have to figure out how), and in the specialCollision code add this:

```javascript
if (type == "ice"){
    this.frictionChange = 0.99/this.friction; // Arithmetic. this.friction * x / this.friction == this.friction / this.friction == x. We can do this same thing with 0.99, 0.8, 1, etc; it's your choice for what feels good.
    return true; // Ice is always solid
}
```

Create an ice on the test level like so: `game.create(-6, 4, 4, 1, "ice", "ice");`. You'll notice that when you leave the ice, your physics remains weird. We need to reset frictionChange! Right after friction is applied, set `frictionChangeX = 1`, like so: `this.frictionChangeX = 1;` (Yeah, there's quite a lot of difference there). You need to do this *after* friction is applied, so that the code has a chance to set frictionChangeX! Now, it should work properly!

Let's add tar. It's the same process, actually, but we'll go over it again: create the CSS rule, add it to checkCollision, and create a specialCollision rule for it that sets frictionChange to `0.5 / this.friction`, I'll let you do the actual code because it's mostly identical to Ice and gives you experience making custom blocks sans help. Tar should be black.

Test tar just by changing the ice test code.

### 5.8: Gunners

I promised in the last chapter that we'd add some exotic types. Let's start with Gunners: create them the way you did Flyers, but don't set friction or isStatic; add a variable `phase` and set it to 0. It should look like this:

```javascript
class GunnerEnemy extends Brick{
    constructor(x, y, width, height, style, type){
        super(x, y, width, height, style, type);
        this.phase = 0;
    }
}
```

Now, add a `loop` function which runs `this.phase += framesElapsed;` after the normal super feeding, like this (the idea is to count frames, not cycles):

```javascript
loop(framesElapsed){
    super.loop(framesElapsed);
    this.phase += framesElapsed;
}
```

Now, check if `this.phase >= 50` and, if it is, reset it to `0`, like this:

```javascript
if (this.phase >= 50){
    this.phase = 0;
}
```

Now, use `this.game._create`, the same way you'd usually use `game.create`, to create a new enemy at `this.x`, `this.y - 50`, with dimensions 10x10, like this:

```javascript
this.game._create(this.x, this.y - 50, 10, 10, "lava", "killu", FlyerEnemy);
```

Replace `FlyerEnemy` in your enemy test code with `GunnerEnemy`. When you reload, you should see a bunch of flyers popping out, about 1 per second, from that Gunner. Unfortunately, eventually, this will make infinite flyers; we want them to expire after a time. So, we need to add a timeout - this is that magical `config` we've been using! Add this to the constructor of `FlyerEnemy`: `this.TTL = config.lifetime || Infinity`. TTL means Time To Live, the `||` means, basically, "if nobody defined lifetime under config, use Infinity". In the loop function, add `this.TTL -= framesElapsed;`, then, check if it's 0 or less. If it's 0 or less, run `this.game.deleteBrick(this)`. Your Flyer should look like this:

```javascript
class FlyerEnemy extends Brick{
    constructor(game, x, y, width, height, style, type, config){
        super(game, x, y, width, height, style, type);
        this.gravity = 0;
        this.friction = 0.9;
        this.frictionY = 0.9;
        this.isStatic = false;
        this.collisions.push("jumpthrough");
        this.TTL = config.lifetime || Infinity;
    }

    loop(framesElapsed){
        super.loop(framesElapsed);
        this.TTL --;
        if (this.TTL <= 0){
            this.game.deleteBrick(this);
        }
        if (this.game.player.x > this.x){ // If the player is behind the enemy, move backwards
            this.xv ++;
        }
        else if (this.game.player.x < this.x){ // Else if only runs if the last if statement didn't run (like else), but also checks for conditions, hence the name.
            this.xv --;
        }
        if (this.game.player.y > this.y){ // If the player is further down than the enemy, move down.
            this.yv ++;
        }
        else if (this.game.player.y < this.y){ // The reverse.
            this.yv --;
        }
    }
}
```

Now, in the Gunner code, add a config to it like this: `this.game._create(this.x, this.y - 50, 10, 10, "lava", "killu", FlyerEnemy, {lifetime: 100});`. We must also add config support to the create functions:

```javascript
_create(x, y, width, height, style, type, bricktype = Brick, config = {}){
    var b = new bricktype(this, x, y, width, height, style, type, config); // Put it in a variable so we can return it later
    this.tileset.push(b); // Add it to the tileset
    return b; // Return it, so you can call this function and then do operations immediately.
}

create(x, y, width, height, style, type, bricktype = Brick, config = {}){
    return this._create(x * this.blockWidth, y * this.blockHeight, width * this.blockWidth, height * this.blockHeight, style, type, bricktype, config);
}
```

You probably originally had a `true` in `new bricktype`, but that was old code that I forgot to deprecate in an earlier chapter.

Run it, and it should work! Mess with `lifetime` all you want to make it fun. If you payed attention, you'll see that in original Platformer gunners don't fire until you're in vision range; this is complicated code which requires lots of time to write and we're running long in this chapter.

### 5.9: Wrapping Up

I know I promised to implement Bats, but this chapter is running overlong and Bats are very complicated; deserving several sections to their own. We will thus have to do them in chapter 6.

Over this chapter, we set up motion fixes, coin stuff, a bugfix, several new types of blocks, and a new enemy type. In the next chapter, we'll add the game interface, level control, and (if we haven't run out of time), bats. I have finals week coming up, so expect chapter 6 to be highly delayed; until then, play around with it and try to make Bats yourself. See you soon!

As always, you can view the code for this chapter [here](https://github.com/LinuxRocks2000/platformer-from-scratch/tree/master/chapter-5).
