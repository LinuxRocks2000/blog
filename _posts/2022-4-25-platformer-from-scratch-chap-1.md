---
name: "Platformer from Scratch chapter 1"
bottomthing: "Getting graphics working"
---

## Learning the Web with Platformer from Scratch

Platformer is a pretty simple game that, if you've been on my site for any extended period of time, you've probably played. If you haven't played it, you should go do that now; if there isn't a link in the header-bar, you can find the link on the main page of my webcomic (which is linked in the top-bar). If you don't want to play, know that it's a 2d aligned-axis grid of tiles on which a player can hop about, collecting coins and power-ups, and dodging/defeating enemies. I recently went through re-making it with multiplayer and discovered that it was actually really simple, even with all the network code, so I decided to write this tutorial. (I may publish a Multiplatformer From Scratch later, but for now we're going to build the single-player original, which is I promise just as cool). In this series, I hope to start from scratch and end with: a level menu, enemies, jumpthrough platforms, and coins; you don't need any HTML, CSS, or Javascript knowledge at the outset, but it's a good idea.

### 1.1 Setting Up a Project

Setting up a project is pretty simple. You'll first need to create a new directory with the name of your project ("platformer-from-scratch", if you want to keep it simple), a fairly universal task on any operating system. Next, create a new text document called `index.html`. If you're on Windows, it won't actually be named `index.html`, it will be named `index.html.txt`: you can fix this by doing View > Show File Extensions in File Explorer, then renaming the file and deleting the `.txt` part. Because of how absolutely intuitive Windows is, it will warn you that you could make the file not work, this is MS jabber that you can ignore. If you're on Ubuntu Linux like myself, the `touch` coreutils command will do proper filenames; I don't know the systems for any IDE you choose, and I don't have any experience on Mac so I can't advise you.

The next two files, `main.css` and `main.js`, should be a breeze to create; if they're not, you should probably Google how to make files on your operating system.

Now, you can open `index.html` in your browser - I use Firefox because if they die freedom of information is lost, as almost every other browser is based upon Google products, and the ones that aren't are not really considered browsers by most developing people (Safari and IE) - aaaaaand... Nothing! You haven't put anything there yet. Never fear, you'll be using that browser tab a lot over this tutorial.

### 1.2 Adding Stuff to index.html

Now is a good time to get an IDE. Notepad/Gedit/Nano/VIM are fine, but for a good development experience, you should use Atom or Intellij or, if you hate software freedom, VS Code. IDEs make finding places in large programs easy because of syntax highlighting, which makes debugging that much sweeter, but it's your choice. If you already know HTML, you should set it up yourself: you'll need a `<div>` with the id "game", but if you don't or don't want the pain, here's a code:

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <title></title>
    </head>
    <body>

    </body>
</html>
```

Basically, you declare it to be an HTML document with `<!DOCTYPE html>`, create an `<html>` tag, put a `<head>` tag inside it, do some stuff there, end the `<head>` with `</head>`, and you can guess the rest. A tag is just `<tag-name></tag-name>`; if you don't have the closing `</tag-name>` it never knows that you ended that tag and will assume everything is inside it. Put the title of your platformer game inside the `<title>` tag, which is to say, between `<title>` and `</title>`. I used `Platformer From Scratch Tutorial chapter 1`.

You don't need to worry about the `<meta>`, that just makes browsers not get mad at you for not declaring the character set.

Now, you need to include your CSS and your JS. Put `<link rel="stylesheet" href="main.css" />` in your `<head>`, so the `head` now looks like this:

```html
<head>
    <meta charset="utf-8">
    <title></title>
    <link rel="stylesheet" href="main.css" />
</head>
```

Notice something peculiar? There's no `</link>`! This is normal, the `link` tag doesn't need it. Furthermore, this `link` has two "properties": `rel` and `href`. A property in HTML is placed before the `>` ending the tag definition, and is in the format `property-name = property-value`. `property-value` is almost always enclosed in double quotes, as you can see. The `rel` property just tells the browser what the link is for - in this case, a stylesheet, and the `href` property gives you the actual url to the file. Because the file is in the same directory, it's just the filename.

Now we must add the Javascript. Insert `<script type="text/javascript" src="main.js"></script>` in your `body` tag, the `script` element can be used to either directly write Javascript or embed Javascript from another location. In this case, we use the `src` property, which tells the browser that it's from an external location, and pass it `main.js`, the filename of our Javascript. Why, you ask, should it not be `href="main.js"` instead? This is just a random quirk of the development of the HTML specification.

Now, we must make a canvas for the game. If you suddenly feel clever and type `<canvas></canvas>`, please know that that's not what I meant at all: if we're going to use CSS to style this game, we can't use a `canvas`; `canvas` does perform graphics, but this tutorial doesn't follow `canvas`. Using elements directly for the game graphics is not only pretty fast, it means we can use CSS for art, which gives us hardware acceleration and a really simple API that does a lot of fun stuff. Instead of `canvas`, thus, create a `div` with the property `id = "main"`. Your full HTML should now look like:

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <title>Platformer From Scratch Tutorial chapter 1</title>
        <link rel="stylesheet" href="main.css" />
    </head>
    <body>
        <div id="game"></div>
        <script type="text/javascript" src="main.js"></script>
    </body>
</html>
```

Notice how the `div` is before the `script`? That's really important! For the `<script>` to do graphics immediately, and we aren't going to do events yet (that's for a later chapter), we need the `<div>` to already exist by the time the browser processes the script. This reliance on browser creation times is actually kinda unclean and not recommended, but it's reliable and works until we cover more advanced concepts such as event listeners for a button click.

Congratulations! You no longer have to edit the HTML until we start on the game interface.

### 1.3: The CSS

CSS not only allows us to make fun art of the game, it allows us to position and move elements. You might want to get familiar, as we'll be using it extensively. To begin, we need to create a skeleton; little of this will make sense until later on in the tutorial, so don't worry if the explanation is lacking. Paste this into `main.css`:
```css
#game > div{
    position: absolute;
}

.normal{
    background-color: brown;
}

.player{
    background-color: green;
}
```

You can probably infer from this that it sets some colors and a `position` to `absolute`. The gibberish before the `{` for each style modification (called a "rule") is called a "selector", it's how CSS finds elements to edit. The first selector looks for every `div` element inside the element with `id = "game"` (`#` in css means "ID=" and `>` means "all children satisfying the next condition"). The second selector looks only for elements with the *class* normal, of which there are none (we'll create them with the script), and the third for class `player`, `.` means "class = " in CSS.

I hope you can see why I use CSS for games; once you learn it, it stays forever, and it's one of the most powerful languages I know because of how easy it is to learn and how much it can do.

The CSS is pretty much complete at this point; we'll develop it much more over the course of the game, and hopefully you'll be able to write your own in the end.

### 1.4: Finally writin' up some JS

Yay, the culmination of this chapter! The Javascript!

I always begin a program with graphics instead of physics/logic. This is simply because the game logic, including physics, is the most prone-to-error part of the program, and if we can't test it, it won't work and the program will stop being fun and interesting. That said, we'd be kinda dumb to not start with very basic physics skeletons, the stuff that doesn't fail, as they're so integral to the game that we'd have to wholly refactor it to add them later. This code ought to go in `main.js`:

```javascript
class PhysicsObject{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
```

This creates a `class`, which is wholly different from HTML and CSS classes: it holds *functions*, which contain code to run, and *member variables*, which store data. For various reasons, classes are integral for clean and extensible game code; I won't go over the reasons now, but do note that it's always cleanest to use classes.

In this Javascript class, we have a `constructor` *function* defined. *Member functions*, the special breed of functions that are always on a class, must:

* Be declared inside the curly braces of the class but nowhere else
* Start with the name of the function (constructor is a special name, we'll get to that soon)
* Have an opening parenthesis
* Optionally have arguments, which are just names separated by commas
* Have a closing parenthesis
* Have a pair of curly braces
* Optionally have code inside the curly braces

As you can see, this *constructor* satisfies all these requirements in order, which is necessary, and the code inside is just a bunch of lines of `this.value = value;`. The `this.value = value` syntax is very useful because it allows you to store data on the object of the class (a class is like a template, the objects are the things that store data); in this case, we just store all the arguments that are passed into the constructor.

#### A brief(ish) word on objects and arguments

Arguments are a really efficient and simple way to allow the user to control what a function does. They are written as names with comma-separation and are always set to values when you call the function. Here's a little example: 

```javascript
class testClass{
    thingFunction(value1){
        alert(value1); // Create an alert box with content being whatever "value1" is
    }
}

var awesomeThing = new testClass(); // Create a new testClass object. Objects are ways of storing unique values.

awesomeThing.thingFunction("haha"); // Creates an Alert Box on your browser tab with the content "haha". Note the "awesomeThing." part, this tells the Javascript interpreter that you're accessing a function contained in an object called awesomeThing.
awesomeThing.thingFunction("Nope"); // Creates an Alert Box on your browser tab with the content "Nope"
```

(You can put this in your code and it will alert "haha" and then "Nope" when you reload the browser tab! I recommend you delete it afterwards to keep your code decluttered.)

Note: All classes can have a special function called `constructor` which is called when you use `new` on it. Here's an example:

```javascript
class anotherExample{
    constructor(yourName){
        alert("Hello, er...");
        alert(yourName);
    }
}

var exampleObject = new anotherExample("John"); // Alert-boxes the words "Hello, er..." and then "John".
```

If you've been paying attention (it's fine if you haven't, this is dull stuff), you'll have seen that we always put "var " before the name of our object. This is because we want Javascript to know that it's a variable, pretty neat huh?



If this confused you, you can get a much better explanation of it at [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#prototype_methods); I permalinked that to the useful bit but you should really read the rest as it's very interesting.

#### Back to the Javascript

Ok, you have a slightly better understanding of classes and objects and functions and stuff, and we can get to the fun part: graphics! Let's start by making a Brick class like so (put it in `main.js` after the PhysicsObject class):

```javascript
class Brick extends PhysicsObject{
    constructor(x, y, width, height, style, type){
        super(x, y, width, height);
    }
}
```

Wait, what? What's with the `extend`? What's with the `super`? That looks like a function, is it like a function we can call after creating an object of the class?

No. First, remember that it has to be inside the curly braces of the class, not anywhere else, so it can't be inside the curlies of the constructor. This is actually a function call that references the *superclass*. A *superclass* is just a normal class that you `extends` on: in this case, the superclass is PhysicsObject. Extending PhysicsObject keeps it clean so that we can use Bricks as physics objects, that allows our physics to be universal. We have to call `super` with all the arguments PhysicsObject's constructor would normally take - `x`, `y`, `width`,  and`height`, and then it builds us a physics object brick. If this was confusing, here's another [MDN article](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends) which covers it pretty well and should help you follow the rest of this tutorial.

Now, in the constructor of the Brick class, add `this.element = document.createElement("div");`. This stores `element` on the Brick object - and sets it to a new element created by `document.createElement("div")`. You can think of `document` like an object with functions you can call on it. In this case, the element is a `div`, the same thing as a `<div>` in HTML, one which is not currently inside any element. Let's fix that by adding `document.getElementById("game").appendChild(this.element)`. 

That's a doozy! Let's go through it step by step:

* The first part, `document.getElementById`: This is another function on `document` which takes the ID of any existing element and gives you that element.
* Next up, `("game")`: The parenthesis mean "call this function", and the `"game"` part is the ID of the element you want. This function should give you the `<div id="game">` you made in the last section.
* `.appendChild`: This is a function *on the element `document.getElementById` gave you*. It adds an element to the child, doing the same thing as this HTML: `<div id="game"><div></div></div>`, which has an untitled div inside the game.
* `(this.element)`: This is why we store things, people! You can access the element you created at any time with `this.element`, as long as it's inside one of the Brick methods. This just puts the brick's element in the game, so you can style it.

Your `main.js` file should now look like this:

```javascript
class PhysicsObject{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}


class Brick extends PhysicsObject{
    constructor(x, y, width, height, style, type){
        super(x, y, width, height);
        this.element = document.createElement("div");
        document.getElementById("game").appendChild(this.element);
    }
}

// Create bricks here, if you want to test it out
```

You should try creating a new Brick object (outside of the Brick class) without the help of the following code:

```javascript
var brick = new Brick(0, 0, 50, 50, "normal", "solid");
```

But if you need it, it's there. Reload the browser tab and hit `ctrl + shift + i`: the developer toolbar will appear. First, click "console" and maybe resize your panes a bit: in "console", you get all the errors. If you don't have any, click your way over to "inspector" and look for the `div` with `id = "game"`. If you didn't create a Brick, there's nothing in it; you can go back to the Console and copy-paste the above brickmaking code in. If you don't get any errors, you can go back to the inspector and there should be something inside the game `div`: an empty `div` element, the element of your Brick!

### 1.5: The Draw Function

The div you created in section 1.4 doesn't do much. Let's fix that.

Create a function on the Brick class called `draw`, it should take no arguments. Inside its curly braces, add

```javascript
this.element.style.width = this.width + "px";
this.element.style.height = this.height + "px";
```

You've probably guessed by now that `this.element` is actually an object, and indeed it has objects all the way down. In this case you access (with `.`) the `style` of `this.element`, and then the `width` of the `style`. You set it to `this.width + "px"`, which directly edits the CSS for the width property.

Wait, what? Where'd `this.width` come from?

Check all the way back up in `PhysicsObject`'s constructor. You'll notice that it stores `width`, `height`, ` x`, and `y`. Yep, that code you wrote a while ago is helping you now.

If you reload the page and there are no errors (if there are, you should probably check your syntax; the error gives you a line and column number), then create a brick without error, nothing will happen. This is because you haven't told it to draw as soon as you make the brick yet. In the `Brick` class constructor, add the line `this.draw()`; at the very end. This will make it draw itself as soon as it's created. Reload and go through the brickbuilding process once more, then check in the inspector: you should see that now the div it creates under the `game` has a `style` property, with some CSS in it. Hover over the element's definition in the inspector with your mouse, and it will highlight an invisible block around the top-left corner of the screen. It works!

Well, if it doesn't work, you can check your code against this:

```javascript
class PhysicsObject{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}


class Brick extends PhysicsObject{
    constructor(x, y, width, height, style, type){
        super(x, y, width, height);
        this.element = document.createElement("div");
        document.getElementById("game").appendChild(this.element);
        this.draw();
    }

    draw(){
        this.element.style.width = this.width + "px";
        this.element.style.height = this.height + "px";
    }
}


var brick = new Brick(0, 0, 50, 50, "normal", "solid"); // Create a 50x50 brick at x 0, y 0
```

If you just copy/pasted that, shame on you. I hate to be a stickler about education, but nobody ever learned anything by copy/pasting! You should really spend some time debugging your code, because you are absolutely going to be doing that in the future without a guide. Rather like attempting to go into free-diving without knowing to swim, more complicated projects are impossible if you don't know how to debug them.

We should probably make it so you can actually position bricks. This is important - if you've played platformer, you know that bricks usually look like they are where you put them. Not having that would be weird. I recommend you learn basic geometry (the coordinate plane) before doing video game development; basically, as X increases you go further towards the right side of the screen, and as Y increases you go further towards the bottom side of the screen. 0, 0 is the top-right-hand corner.

The CSS properties for x and y are left and top respectively. I recommend you attempt to set them yourself, but here is the code that goes in the draw function:

```javascript
this.element.style.left = this.x + "px";
this.element.style.top = this.y + "px";
```

Note: Most CSS properties need a unit. In this case, I measure in pixels ("px"); you can use inches ("in") or centimeters (I don't use centimeters on websites, you can google it) or whatever but you'll have to change the brick sizing: 50 pixels generally looks good for the base block scale in Platformer and every object is aligned to a 50x50 square grid. We'll go about enforcing this later.

Now, in your block creation command, you have to set an X and a Y instead of 0. The template command:

```javascript
var my_brick_name = new Brick(x, y, width, height); // Ignore style and type, those come in later.
```

Thus, if you wanted a 50x100 block at 150(x), 250(y), you'd do:

```javascript
var brick = new Brick(150, 250, 50, 100); // Ignore style and type, those come in later.
```

If you open developer tools and then expand it upwards, you'll notice that a scrollbar appears: this is because your block no longer fits on the screen. This is undesirable as it ruins the user experience, scrollbars make positioning weird. You can fix this by editing `main.css` and adding this selector and rule:

```css
body {
    overflow: hidden;
}
```

The overflow property changes how the element handles overflowing things. In this case, the overflowing element is `body` (if you look, the `#game` element is still tiny and fixed at one place, this is because of how positioning influences element parenthood!), and we tell it to simply hide elements that overflow. Nice and clean and simple.

#### Making it look pretty

This doesn't deserve to be a completely new section as it's fairly straightforward: we need to visit the Brick constructor again.

Inside the Brick constructor, we can add classes to our element like so: `this.element.classList.add("My-class-name")`. Theoretically, you could add style to bricks just like that; this is however not a desirable method as it decreases code cleanliness and makes it harder to change brick types. Instead, you should add:

```javascript
this.type = type;
this.element.classList.add(style);
this.element.classList.add(type);
```

This just makes the style, one of the arguments to the function, a class. We also use type as a class, not because it's meant for that, but because it makes it easier. While we're at it, we also store type for later; this is useful for collisions code. Your constructor should now look like this (minus the comments, I added those for clarity):

```javascript
constructor(x, y, width, height, style, type){
    super(x, y, width, height); // Initialize PhysicsObject
    this.element = document.createElement("div"); // Create a block element and store it to this.element
    document.getElementById("game").appendChild(this.element); // Append the block element to the game element
    this.type = type; // Make this.type = type, so you can check it later in collision code (such as touching a death brick)
    this.element.classList.add(style); // Add the coloring style as a class
    this.element.classList.add(type); // Add the collision type as a class, so you can do fun stuff with it later
    // This happens last!
    this.draw();
}
```

If you run it and add a brick following the old method, you'll see..... Nothing! You haven't set a style yet. Here's an example:

```javascript
var brick = new Brick(100, 100, 50, 50, "normal", "solid");
```

Now you should see a new brick! Play around a bit and get familiar with it, maybe add some new types via CSS and JS? It's designed to be very extensible.

### 1.6: Wrapping Up

You now have 30-40 lines of code that create easily modified Platformer bricks!

In the next chapter, we'll add players, perspectives, and a game loop. See you then!

You can view the full code for this chapter on GitHub [here](https://github.com/LinuxRocks2000/platformer-from-scratch/tree/master/chapter-1).

