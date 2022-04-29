---
name: "Platformer From Scratch chapter 4"
bottomthing: "Extending the physics engine for special bricks and the coins!"
---

Welcome to the fourth episode of Platformer From Scratch! In this chapter, we'll put the finishing touches on the physics engine and add lava, coins, and basic enemies, as well as implement player death. Finally, we'll add a minimum-extent clause to the `_create` command which allows us to kill the player if it falls off a platform. Let's get started!

### 4.1: Finishing the physics engine- for real this time

Right now, our physics engine is very fixed and can do nothing but hit solid objects. We're going to change that now by exploiting class inheritance.

Create 4 empty methods on the `PhysicsObject` class, named `hitBottom` (to be called when the player hits something on it's bottom edge), `hitTop` (same idea), `hitLeft`, and `hitRight`, like so:

```javascript
hitBottom(){

}

hitTop(){

}

hitLeft(){

}

hitRight(){

}
```

Now, add these to the collision area. When `this.touchingTop` is set to `true`, `this.hitTop` must be called, and the same pattern for the other three sides; this allows for more advanced physics later on. Your `loop` function in `PhysicsObject` should now look like this:

```javascript
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
                this.hitRight();
            }
            else if (this.xv < 0){ // Negative velocity =  moving left
                this.touchingLeft = true;
                this.hitLeft();
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
                this.hitBottom();
            }
            else if (this.yv < 0){ // Negative velocity = moving up
                this.touchingTop = true;
                this.hitTop();
            }
            this.yv = 0;
        }
    }
}
```

This doesn't seem to do a whole lot, but here's the trick: in anything inheriting from `PhysicsObject`, if you define a function `hitTop` or `hitBottom` or `hitLeft` or `hitRight`, that function will be called every time the player hits the respective side - this makes physics handling very easy. However, right now, other types of brick won't work in physics - they'll either register as solid, or Player will pass right through them. If we want jump-through platforms and the like, we'll need to make the engine more advanced. Start by adding another `forEach` to the `doCollision` function, this one one `this.specialCollisions`, like so:

```javascript
this.specialCollisions.forEach((item, index) => {

});
```

That wasn't so bad. We've done a lot of `forEach`es, so I hope you understand the syntax by now; if you don't, you can always visit the one true love of all developers: [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach). Now, inside the new `forEach`, do the same check as the previous one:

```javascript
if (coll[item][0] > 0){

}
```

Pretty simple. Check if the collisionset's entry for the current referenced collision type exists. However, we don't want to set `returner[0]` to `true` or `push` anything to `returner[1]`, we want to call a function for special collisions:

```javascript
this.specialCollision(item);
```

Note that `this.specialCollision` doesn't exist yet; you can define it as an empty function along with the `hit<side>` functions. It will be *overridden* in `PhysicsObject` children that need it. We may add logic for conditional collisions with special types later; for now, they cannot trip real collisions.

Your `doCollision` function should now look like this:

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
            this.specialCollision(item);
        }
    });
    return returner;
}
```

That wasn't so bad, right? And now, we can set up special collisions for a new type: lava! Start by adding a new call to your brick creation area: `game.create(<x>, <y>, 1, 1, "lava", "killu")`. Run it and... nothing! We haven't defined a style rule for lava yet, so it's time to revisit the CSS. Go into `main.css` and add:

```css
.lava{
    background-color: red;
}
```

Does this look familiar? Good, it's almost the same code as for normal bricks, just with a different class name (`lava` instead of `normal`) and with a different color. When you run it, you should see a red lava brick!

If you have issues with block creation, you can use this updated test level:

```javascript
game.create(-2, 4, 7, 1, "normal", "solid");
game.create(-2, 3, 1, 1, "normal", "solid");
game.create(4, 3, 1, 1, "normal", "solid");
game.create(3, 3, 1, 1, "lava", "killu");
```

Try running into the lava and the game will freeze; if you open the development console, you'll see a slurry of errors. This is because we haven't defined the collisions yet. Go back into the `checkCollision` method and add this to the collisions dictionary:

```javascript
..., // In this case, ... is the last element. Add the comma, it's important!
"killu": [0, []] // The type is "killu". I know, I know. I wrote this when I was 12 and wasn't motivated enough to change the names.
```

Your collisions dict should now look like this:

```javascript
var collisionsDict = {
    "solid": [0, []], // Remember the word "solid" from when you created a brick? This references that!
    "allBricks": [0, []], // Each entry stores an array containing a number (the number of things in it) and another array, the things themselves.
    "allPlayers": [0, []], // Every player in the collision. Above is every block.
    "all": [0, []],
    "killu": [0, []] // The type is "killu". I know, I know. I wrote this when I was 12 and wasn't motivated enough to change the names. // Everything.
}
```

And if you run, it should work; you will however not collide with the lava; you'll pass right through it. This is because there's no collisions rule yet, so in the Player constructor add this line at the very end:

```javascript
this.specialCollisions.push("killu"); // Register killu as a special collision type
```

Now, define a `specialCollision` method on the `Player` class. It should take one argument: `type`, this is just defining the function you've already started using in special collisions. You can put an `alert` statement in there just to make sure it works: this is called bug prevention. Your function should thus look like this:

```javascript
specialCollision(type){
    alert(type);
}
```

This should alert ("killu") when you run into the lava, if not, your code is broken. In fact, it'll alert it again. And again. And again. Over and over and over, until you exit the tab or just ignore it. This is because you never die! We need to add death now. Create a method on `Game` called `die`, which takes no arguments, like so:

```javascript
die(){

}
```

(Yeah, yeah, I know we've been through this and you know the drill, just putting that in for clarity.)

The `die` function should first do a complex little `forEach` over the tileset:

```javascript
this.tileset.forEach((item, index) => {
    item.remove();
});
```

We haven't defined a remove function for blocks yet, unfortunately, so nothing but errors will happen; we can fix this by defining it on the `Brick` class like so:

```javascript
remove(){
    this.element.parentNode.removeChild(this.element);
}
```

This is gnarly, so let's walk through it:

* `this.element`: This is the element.
* `.parentNode`: This is the parent element; the one we ran `appendChild` on. It's `div#game`, if you like CSS selectors.
* `.removeChild(`: all elements support this function, it removes a set child element.
* `this.element`: We want to remove this element from it's parent, this does it successfully.

Finally, in the `Player` `specialCollision` function, add this:

```javascript
if (type == "killu"){
    this.game.die();
}
```

This just checks if it hit a killu, then if it did, ends the game: all the blocks disappear. They're still there, however, simply no longer drawing. We need to erase the actual bricks themselves so they can no longer collide; if you create a new brick, you'll be able to use it as reference to see that the player still collides with the old ones. We must actually delete the content of the array after the `forEach`:

```javascript
this.tileset.splice(0, this.tileset.length);
```

This simply splices away the entire list. If you don't understand how splicing works, you can check at our favorite developer site [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice).

If you run it now and die, you'll notice that the player's `y` (`game.player.y` in the console) is increasing ridiculously - something it wouldn't do if there was still a merely hidden brick under it.

 We must finally erase the player; however, we don't want to actually delete it, we want to reuse it. First, define a `endGame` function on the player, like so:

```javascript
endGame(){
    this.element.style.display = "none"; // This sets the css property display to none, hiding it and making it inactive.
}
```

Call it after you erase the tileset: `this.player.endGame()`.

Now, when you reload and hit lava, you die! If you want to make a healthbar, go ahead; I don't intend to add that to Platformer from Scratch, however.

### 4.2: Coins

Start by defining a CSS rule for `.coin` which sets `background-color` to `yellow`. It should look like this:

```css
.coin{
    background-color: yellow;
}
```

If you were wondering how I produced the current coin graphics, it's very complex CSS and we won't visit that in this chapter.

Now, create a coin the way you created the lava but with `tencoin` as the type; here's the test level:

```javascript
game.create(-2, 4, 7, 1, "normal", "solid");
game.create(-2, 3, 1, 1, "normal", "solid");
game.create(4, 3, 1, 1, "normal", "solid");
game.create(3, 3, 1, 1, "lava", "killu");
game.create(2, 3, 1, 1, "coin", "tencoin");
```

Hit it, and the engine breaks again. What do you think the problem is? Hint: it's the same issue as we had with Lava. Scroll down for the fix.
<div style="height: 100vh">
</div>
The issue is that we never added `tencoin` to our collision code; the fixed collisions dict looks like this:

```javascript
var collisionsDict = {
    "solid": [0, []], // Remember the word "solid" from when you created a brick? This references that!
    "allBricks": [0, []], // Each entry stores an array containing a number (the number of things in it) and another array, the things themselves.
    "allPlayers": [0, []], // Every player in the collision. Above is every block.
    "all": [0, []], // Everything
    "killu": [0, []], // The type is "killu". I know, I know. I wrote this when I was 12 and wasn't motivated enough to change the names.
    "tencoin": [0, []]
}
```

Now, when you bump the coin, you simply go through it like you did with the lava. We need to add special collision code for it! You can do this the way you did for lava in the `Player` constructor, like this: `this.specialCollisions.push("tencoin") // Add ten coins to special collisions`.

 We can now actually run collisions on tencoins in the `specialCollision` function:

```javascript
... // This, as always, signifies the old code
if (type == "tencoin"){

}
```

And then... what? We can't put anything there because we don't have a reference to the brick. So, let's make the `PhysicsObject` `doCollision` code pass us a Brick object. First, in `doCollision`, edit the call to `this.specialCollision` by passing `coll[item][1]` to it, like so:

```javascript
this.specialCollision(item, coll[item][1]);
```

Now, we have access to a list of bricks from the `specialCollision` function! Add a new argument to the constructor, `items`, and we can do a `forEach` inside the `if (type == "tencoin")`, like this:

```javascript
items.forEach((item, index) => {
	this.game.deleteBrick(item);
});
```

Your full specialCollision function should now look like this:

```javascript
specialCollision(type, items){
    if (type == "killu"){
        this.game.die();
    }
    if (type == "tencoin"){
        items.forEach((item, index) => {
            this.game.deleteBrick(item);
        });
    }
}
```

If you observe, you'll notice that there is no `deleteBrick` function on `Game`. Let's add that now; I'll let you figure out how to add a function that takes an argument `brick` as we've done this many times over. Inside the function, add `brick.remove();` (because `brick` is a normal `Brick` object), and you can now try running the program. The coin will delete when you touch it, and the game will crash; this is because you keep touching the virtual brick and it's trying to remove graphics that don't exist any more. We can fix this by adding `this.tileset.splice(this.tileset.indexOf(brick), 1);` in front of `brick.remove` in the `deleteBrick` function. This is gnarly, so let's go over it step by step:

* `this.tileset`: Our tileset.
* `.splice`: If you read the MDN article referenced above, you'll know.
* `this.tileset.indexOf(brick)`: Ah yes something new. This finds the index in an array of an element. If you have an array like`var myArray = ["a", "b", "c"];` and you run `myArray.indexOf("b")`, you'll get 1; if you run `myArray.indexOf("d")`, you'll get -1 which signifies that it doesn't exist. For more, view the most acclaimed [MDN article](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf).
* `, 1`: Splice for one index only, so we only delete one brick. We can at this point let the garbage collector do the rest and know that, being no longer held anywhere, the Brick object will simply be truly deleted.

Note: If you're uncommonly observant, you might notice that the brick in question is probably not going to be deleted immediately because it's stored in a `coll` array somewhere. To put it simply, that `coll` array will be eventually thrown out too, so you don't have a memory leak. Your `deleteBrick` code should look like this now:

```javascript
deleteBrick(brick){
    brick.remove();
    this.tileset.splice(this.tileset.indexOf(brick), 1);
}
```

Reload and run into the coin - no errors, it deletes! You don't have a score counter yet, however, so let's implement that. Store a value `this._score` to `0` in `Player`'s `constructor`, like this: `this._score = 0;`. The reason why we use `_score` instead of `score` is a fairly obscure (yet very well-known) Javascript feature: in Javascript, on a class, you can define special functions that run every time you try accessing or editing a value on an object of that class. These are called "getters" and "setters", and they can be used to run a code, such as updating the score on screen every time the score is updated. If you still don't understand, here's the beautiful MDN articles on the subject: [getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get), [setter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set). We define the `score` getter like so:

```javascript
get score(){
    return this._score;
}
```

Nice and easy, right? Since `_score` is the actual variable that gets edited, we can just return it. The reason we need this extra `_score` is so we can define a setter:

```python
set score(val){
    this._score = val;
    this.element.innerHTML = this._score;
}
```

(These should both be on the player class). You can test it like this in the console: `game.player.score = 10;`, you should see a score counter appear! Your player class should now look like this (yes, I disabled selecting):

<pre class="noselect">
    <code class="language-javascript">
class Player extends PhysicsObject{
    constructor(game, x, y, width, height){
        super(game, x, y, width, height);
        this.element = document.createElement("div");
        document.getElementById("game").appendChild(this.element);
        this.element.classList.add("player");
        this.draw();
        this.keysHeld = {}; // {} means a new dictionary-like object.
        document.addEventListener("keydown", (event) => {
           this.keysHeld[event.key] = true;
        });
        document.addEventListener("keyup", (event) => {
            this.keysHeld[event.key] = false;
        });
        this.specialCollisions.push("killu"); // Register killu as a special collision type
        this.specialCollisions.push("tencoin") // Add ten coins to special collisions
        this._score = 0;
    }


    set score(val){
        this._score = val;
        this.element.innerHTML = this._score;
    }
    
    get score(){
        return this._score;
    }
    
    draw(){
        this.element.style.left = (window.innerWidth - this.width) / 2 + "px";
        this.element.style.top = (window.innerHeight - this.height) / 2 + "px";
        this.element.style.width = this.width + "px";
        this.element.style.height = this.height + "px";
    }
    
    Jump(){
        if (this.touchingBottom){
            this.yv = -20;
        }
    }
    
    Left(){
        this.xv -= 3;
    }
    
    Right(){
        this.xv += 3;
    }
    
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
    
    specialCollision(type, items){
        if (type == "killu"){
            this.game.die();
        }
        if (type == "tencoin"){
            items.forEach((item, index) => {
            	this.game.deleteBrick(item);
            });
        }
    }
    
    endGame(){
        this.element.style.display = "none"; // This sets the css property display to none, hiding it and making it inactive.
    }
}
    </code>
</pre>

Now, we can change up the `Player` `specialCollision` function to increment the score counter when it touches a coin, by adding `this.score += 10;` in the deletion loop, like so:

```javascript
if (type == "tencoin"){
    items.forEach((item, index) => {
        this.game.deleteBrick(item);
        this.score += 10;
    });
}
```

Run the game, hit the coin, and.... You get a score counter and ten points!

### 4.3: Making coins not ugly

Your code works well, however, the coin is pretty ugly, so let's fix the CSS a bit. Go into `main.css` and, under `.tencoin`, add this rule: `border-radius: 100%`. Border-radius rounds the edges of any element, so you can turn rectangles into circles; 100% means it rounds it completely. Your coin style should now look like this:

```css
.coin{
    background-color: yellow;
    border-radius: 100%;
}
```

It's hard to understand the coin type without having some text, so let's add this in the `Brick` constructor:

```javascript
if (type == "tencoin"){
    this.element.innerHTML = "<span>10</span>";
}
```

(This should be after element create code). This creates a new `span` element with the content "10" and puts it inside the coin element; if you run it now, you should see the "10" on the coin, but it looks absolutely contemptible. Let's add this little piece of CSS to a new rule `.coin > span` (which controls that span), like so:

```css
.coin > span{
    display: inline-block;
    position: relative; /* Relative is easier to read than absolute in this case - it should be placed *relative* to the outer brick */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

Yay, now the "10" is centered! We'll add 50 coins, animation, and the rest of the style in the next chapter; for now, you should play with it to try and make it your own.

### 4.4: Custom brick JS

Right now, we have fixed-position bricks that don't do a lot, but our physics engine is much more powerful than that! Let's start on enemies. Define a new class extending `Brick` called `NormalEnemy`, like so:

```javascript
class NormalEnemy extends Brick{
    constructor(game, x, y, width, height, style, type, config){
        
    }
}
```

We can ignore `config` for now - we'll use it for things like speed later - but we can use all the other arguments in `super`, like this: `super(game, x, y, width, height, style, type);`, this ensures that the player will collide with it as a lava. Also, add `this.xv = 5`, so that it starts off moving, and `this.friction = 1;` so it doesn't decelerate. Finally, make it not static with `this.isStatic = false`; otherwise no physics code will run. Note that our `NormalEnemy` can be any brick type, we want it to usually be `lava killu`. It should look like this:

```javascript
class NormalEnemy extends Brick{
    constructor(game, x, y, width, height, style, type, config){
        super(game, x, y, width, height, style, type);
        this.xv = 5;
        this.friction = 1;
        this.isStatic = false;
    }
}
```

Now we need to revamp our create commands. Rather than explain all the tedious code, I'll just give it to you with comments; because this isn't distinctly related to the rest and is fairly complex, I don't want to waste 500 words on it. Here's your new create function code:

```javascript
_create(x, y, width, height, style, type, bricktype = Brick){ // Pass a class as an argument, so we can pass custom classes.
    var b = new bricktype(this, x, y, width, height, style, type, true); // Create a new "bricktype", which is by default equal to Brick.
    this.tileset.push(b); // Add it to the tileset
    return b; // Return it, so you can call this function and then do operations immediately.
}

create(x, y, width, height, style, type, bricktype = Brick){ // Same thing pretty much but uses _create.
    return this._create(x * this.blockWidth, y * this.blockHeight, width * this.blockWidth, height * this.blockHeight, style, type, bricktype);
}
```

Where you do your test level, add a new `game.create(<x>, <y>, 1, 1,  "lava", "killu", NormalEnemy);`. You might want to add a bit more to the level to make it more suitable for a player to survive without being hit; here's the test level I'm using:

```javascript

// Demo
var game = new Game(50, 50);

game.create(-2, 4, 14, 1, "normal", "solid");
game.create(-2, 3, 1, 1, "normal", "solid");
game.create(4, 3, 1, 1, "normal", "solid");
game.create(11, 3, 1, 1, "normal", "solid");
game.create(8, 2, 1, 1,  "lava", "killu", NormalEnemy);

function mainloop(){
    game.loop();
    window.requestAnimationFrame(mainloop);
}
window.requestAnimationFrame(mainloop);
```

Run it and you should see a weird red brick fall and then push into the wall. It doesn't bounce back! That's because we haven't defined any collision functions; let's do that now. In `NormalEnemy` add the functions `hitLeft` and `hitRight` like below:

```javascript
hitLeft(){
    this.xv *= -1;
}

hitRight(){
    this.xv *= -1;
}
```

Both of these just do the same thing, this is because of the way we defined our physics engine: if you want to catch collisions on the left and collisions on the right, you have to define for both. The `*= -1` just reverses it: if it's positive, it becomes negative, if it's negative, it becomes positive. If you try it... Nothing happens! That's because when you collide, `xv` is set to 0. Let's add two new physics options to PhysicsObject (just store the value on the object), like this:

````javascript
this.zeroOnHitX = true;
this.zeroOnHitY = true;
````

And now, where you set `this.xv = 0;` and `this.yv = 0;`, wrap them in an `if` statement like this:

```javascript
if (this.zeroOnHit/*X or Y depending on if this is Xv or Yv*/){
    // the old zero code.
}
```

I'll be nice and give you the full PhysicsObject code now:

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
        this.zeroOnHitX = true;
        this.zeroOnHitY = true;
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
            this.move(0, this.yv);
            var collY = this.doCollision(this.game.checkCollision(this));
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
                this.specialCollision(item, coll[item][1]);
            }
        });
        return returner;
    }
    
    move(xm, ym){
        this.x += xm;
        this.y += ym;
    }
    
    hitBottom(){
    
    }
    
    hitTop(){
    
    }
    
    hitLeft(){
    
    }
    
    hitRight(){
    
    }
    
    specialCollision(type){
    
    }
}
    </code>
</pre>

Of course, I disabled selecting. Now that we have this, let's add to the NormalEnemy constructor: `this.zeroOnHitX = false;`, so it doesn't zero and you rebound properly. Note that we don't want to set `this.zeroOnHitY`, if we do the enemy will perform well until it suddenly falls out of the platform because it never zeroed YV and eventually got moving so fast it went right through it. Reload the code and... It bounces and moves! Try hitting it... you die! Yay, our first enemy!

### 4.5 Wrapping Up

In this chapter, we made coins and custom bricks, and finished the physics engine. Most of our code is actually finished, so in chapter 5 we'll finish adding the rest of the features:

* 50 coins and coin animation
* Flyer enemies
* Jump-through platforms
* Ice
* Tar
* Gunners enemies (which shoot flyers)
* Bat enemies (which drop to the ground then turn into flyers)

And in chapter 6, we'll finish the series with a full level menu and saved games.
For now, play with it a bit and hopefully add some more features of your own; see you in chapter 5!

As always, you can view the code for this chapter on [Github](https://github.com/LinuxRocks2000/platformer-from-scratch/tree/master/chapter-4/).
