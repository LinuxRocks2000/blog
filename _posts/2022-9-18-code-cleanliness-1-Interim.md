---
title: "Interim: Code Cleanliness for Web Developers"
bottomthing: "Connecting concepts from Code Cleanliness part 1 to HTML and CSS"
---

# Interim: Code Cleanliness for Web Developers

I realized last night (after publishing, sadly) that my Code Cleanliness part 1 document did *not* cover much in HTML! The concepts, fortunately, are mostly the same, so I'm not going to bother writing a full-fledged chapter on the subject; this little Interim connecting the concepts we learned in the first article to web development will hopefully be enough.

## 1-Interim.1: The importance of clean markup

**Diction note**- A term I use for an HTML file is your markup. This is because HTML is really an acronym from the 90s when complex, somewhat meaningless acronyms were really pretty useful everywhere: **H**yper**T**ext _**M**arkup_ **L**anguage. I dare you to say *that* three times fast. Technically "markup" can mean both more and less than HTML (depending on the situation) but I use it interchangeably with HTML over these documents.

HTML, I think, may be the most susceptible language in these courses to bad code. The others can be intuited fairly easily, and if you mess it up a bit it doesn't really hurt you too much. In HTML, however, the only even slightly intuitive bit is tabs, and newlines/spaces are almost entirely up to you. This would be fine, of course, but HTML is also somewhat dependent on readability, as it gets impressively unreadable and undebuggable if you don't adhere to some kind of convention. My goal for this demi-chapter is to give you some basic conventions that almost everyone follows to help you make your code readable by yourself and others.

Since my favorite way to write blog posts is big code blocks, without further ado I present to you... the badly formatted markup!

(This is stolen and edited from one of my sites.)

```html
<!DOCTYPE html>
<html lang="en" dir="ltr"><head><meta charset="utf-8"> <title>And I'll make a title out of you (indeed, my Mulan references are "cringe")</title>
<link rel="stylesheet" href="main.css" />
  </head>
<body><div id="main">
<div id="topstuff">
 <h1>Sample Page that totally wasn't once Not Art Gallery</h1><h2>
                    A secondary heading.
                </h2><p>
                    This used to be some text in a P, but I decided to replace it with a baseball ipsum (there's a lot of these out there). Baseball ipsum dolor sit amet passed ball outs, sweep stretch bleeder triple play. Left fielder count fair swing cork balk ball. Full count southpaw reliever lineup crooked number fastball second base. Perfect game outfielder rally force dodgers right fielder dead ball era right field. Pickoff world series peanuts batting average cup of coffee foul inside robbed. Bleeder club appeal first base sidearm mustard steal line drive inning.
                </p><p>
                    There was once more P text here. I like the... british ipsum? more. Pommy ipsum 221B Baker Street ey up chuck down the local chap beefeater, guinness nosh jammy git put me soaps back on bowler hat complete mare spend a penny, accordingly rambunctious middle class well chuffed lass. Cheesed off ask your mother if a tenner a right corker in the goolies marmite devonshire cream tea, black pudding horses for courses pot noodle gobsmacked pillock. Done up like a kipper Bob's your uncle half-inch it a tad a right toff sling one's hook, gallivanting around houlligan Time Lord. Yorkshire pudding gosh biscuits Southeners cor blimey' nigh, knows bugger all about nowt sausage roll gobsmacked pork dripping. 
      </p> <p>
                    Used to be a single sentence instead of a full paragraph. To reflect, I've cut down the ipsum. Lorem ipsum dolor sit amet.
</p><span id="bouncy" style="font-family:monospace;color:green;background-color:lightblue;">[Scroll Down (two fingers)]</span>
            </div><div class="gradient-scrolly">
            </div>
<div id="cred">       First line of the credits - these are really cool on the full site<br>
                                <span>Second credits line (also cool)</span><br>
                                     Not that cliche, kinda cool still
     <!-- Side note: This doesn't work for centering. The browser deletes all those extra spaces during render! -->
                              <!-- Instead, use text-align:center; in CSS. -->
            </div>
<div id="carousel" onmouseover = "carouselHovered()" onmouseleave = "carouselUnhovered()"><div class = "image">
A piece of art!
       <img src="res/art.png"/>
                </div><div class = "image">
           A piece of art!<img src="res/art1.png"/>
                </div><div class = "image"> A piece of art!     <img src="res/art2.png"/></div><div class = "image">
                    A piece of art!<img src="res/art3.png"/>
    
                </div>
<div class = "image"> A piece of art!
     <img src="res/art4.png"/>
        </div>
         <div class = "image">A piece of art!
                    <img src="res/art5.png"/> </div>
                <div class = "image">
  A piece of art!<img src="res/art6.png"/>
 </div>
        </div><div class="gradient-down" style="z-index: 1;position:relative;">
    
    </div>
  <div id="understuff" style="z-index: 2;position:relative;"><p>
                    A little piece on contributing to this site<br>
                    Some <b>rules</b> on submission<br> </p>
    <p>
 <input type="text" id="urname" placeholder="Your name"></input><br><label id = "submitFile" for="submitFileInput">Upload your image</label>
      <input type="file" id="submitFileInput" accept="image/png, image/jpeg"/><br>
<img id="filepreview" src="">   <button id="submitbutton" onclick="sendimage()" style="display: none;">Send</button>
                </p>   </div>
</div>
    <div id="shadowbox" class="hidden"> <img src="foo"/>
  </div> <div id="submittedDongle" style="display: none">
      <span style="font-size: 1.3em;">Generic "your submission is complete" text!</span><br>
       Some explanatory text about your submission!
   </div> <script src="https://npmcdn.com/parse/dist/parse.min.js"></script>
        <script src="main.js">

</script> </body>
				</html>
```

(Unless I phenomenally screwed up, all I did to this one was add/delete spaces, newlines, and tabs. If you copy/paste this into replit or similar it won't work because you don't have my JavaScript, CSS, and images.)

Not very readable, right? You can still edit the text and everything, but efficiently editing or debugging the markup? Un-possible, to quote the mad hatter. I'd recommend that you imagine trying to find the bug in the markup, but you don't merely have to imagine it, I have a broken markup prepared for you:

```html
<!DOCTYPE html>
<html lang="en" dir="ltr"><head><meta charset="utf-8"> <title>And I'll make a title out of you (indeed, my Mulan references are "cringe")</title>
<link rel="stylesheet" href="main.css" />
  </head>
<body><div id="main">
<div id="topstuff">
 <h1>Sample Page that totally wasn't once Not Art Gallery</h1><h2>
                    A secondary heading.
                </h2><p>
                    This used to be some text in a P, but I decided to replace it with a baseball ipsum (there's a lot of these out there). Baseball ipsum dolor sit amet passed ball outs, sweep stretch bleeder triple play. Left fielder count fair swing cork balk ball. Full count southpaw reliever lineup crooked number fastball second base. Perfect game outfielder rally force dodgers right fielder dead ball era right field. Pickoff world series peanuts batting average cup of coffee foul inside robbed. Bleeder club appeal first base sidearm mustard steal line drive inning.
                </p><p>
                    There was once more P text here. I like the... british ipsum? more. Pommy ipsum 221B Baker Street ey up chuck down the local chap beefeater, guinness nosh jammy git put me soaps back on bowler hat complete mare spend a penny, accordingly rambunctious middle class well chuffed lass. Cheesed off ask your mother if a tenner a right corker in the goolies marmite devonshire cream tea, black pudding horses for courses pot noodle gobsmacked pillock. Done up like a kipper Bob's your uncle half-inch it a tad a right toff sling one's hook, gallivanting around houlligan Time Lord. Yorkshire pudding gosh biscuits Southeners cor blimey' nigh, knows bugger all about nowt sausage roll gobsmacked pork dripping. 
      </p> <p>
                    Used to be a single sentence instead of a full paragraph. To reflect, I've cut down the ipsum. Lorem ipsum dolor sit amet.
</p><span id="bouncy" style="font-family:monospace;color:green;background-color:lightblue;">[Scroll Down (two fingers)]</span>
            <div class="gradient-scrolly">
            </div>
<div id="cred">       First line of the credits - these are really cool on the full site<br>
                                <span>Second credits line (also cool)</span><br>
                                     Not that cliche, kinda cool still
     <!-- Side note: This doesn't work for centering. The browser deletes all those extra spaces during render! -->
                              <!-- Instead, use text-align:center; in CSS. -->
            </div>
<div id="carousel" onmouseover = "carouselHovered()" onmouseleave = "carouselUnhovered()"><div class = "image">
A piece of art!
       <img src="res/art.png"/>
                </div><div class = "image">
           A piece of art!<img src="res/art1.png"/>
                </div><div class = "image"> A piece of art!     <img src="res/art2.png"/></div><div class = "image">
                    A piece of art!<img src="res/art3.png"/>
    
                </div>
<div class = "image"> A piece of art!
     <img src="res/art4.png"/>
        </div>
         <div class = "image">A piece of art!
                    <img src="res/art5.png"/> </div>
                <div class = "image">
  A piece of art!<img src="res/art6.png"/>
 </div>
        </div><div class="gradient-down" style="z-index: 1;position:relative;">
    
    </div>
  <div id="understuff" style="z-index: 2;position:relative;"><p>
                    A little piece on contributing to this site<br>
                    Some <b>rules</b> on submission<br> </p>
    <p>
 <input type="text" id="urname" placeholder="Your name"></input><br><label id = "submitFile" for="submitFileInput">Upload your image</label>
      <input type="file" id="submitFileInput" accept="image/png, image/jpeg"/><br>
<img id="filepreview" src="">   <button id="submitbutton" onclick="sendimage()" style="display: none;">Send</button>
                </p>   </div>
</div>
    <div id="shadowbox" class="hidden"> <img src="foo"/>
  </div> <div id="submittedDongle" style="display: none">
      <span style="font-size: 1.3em;">Generic "your submission is complete" text!</span><br>
       Some explanatory text about your submission!
   </div> <script src="https://npmcdn.com/parse/dist/parse.min.js"></script>
        <script src="main.js">

</script> </body>
				</html>
```

Now you *could* just compare it with the one that works (I believe some tools exist for that, actually, to simplify the process), but pretend you don't want to do that. You will only very rarely have a working version and a broken version that are so close together that you can just swap the non-functioning code with the functioning and call it a day. Can't find the bug? I wouldn't be able to either. Hiding the bug took me a minute or so, even, and I was only deleting 5 characters. So what if the formatting was fixed? Can you find the bug in this version?

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <title>And I'll make a title out of you (indeed, my Mulan references are "cringe")</title>
        <link rel="stylesheet" href="main.css" />
    </head>
    <body>
        <div id="main">
            <div id="topstuff">
                <h1>Sample Page that totally wasn't once Not Art Gallery</h1>
                <h2>
                    A secondary heading.
                </h2>
                <p>
                    This used to be some text in a P, but I decided to replace it with a baseball ipsum (there's a lot of these out there). Baseball ipsum dolor sit amet passed ball outs, sweep stretch bleeder triple play. Left fielder count fair swing cork balk ball. Full count southpaw reliever lineup crooked number fastball second base. Perfect game outfielder rally force dodgers right fielder dead ball era right field. Pickoff world series peanuts batting average cup of coffee foul inside robbed. Bleeder club appeal first base sidearm mustard steal line drive inning.
                </p>
                <p>
                    There was once more P text here. I like the... british ipsum? more. Pommy ipsum 221B Baker Street ey up chuck down the local chap beefeater, guinness nosh jammy git put me soaps back on bowler hat complete mare spend a penny, accordingly rambunctious middle class well chuffed lass. Cheesed off ask your mother if a tenner a right corker in the goolies marmite devonshire cream tea, black pudding horses for courses pot noodle gobsmacked pillock. Done up like a kipper Bob's your uncle half-inch it a tad a right toff sling one's hook, gallivanting around houlligan Time Lord. Yorkshire pudding gosh biscuits Southeners cor blimey' nigh, knows bugger all about nowt sausage roll gobsmacked pork dripping.
                </p>
                <p>
                    Used to be a single sentence instead of a full paragraph. To reflect, I've cut down the ipsum. Lorem ipsum dolor sit amet.
                </p>
                <span id="bouncy" style="font-family:monospace;color:green;background-color:lightblue;">[Scroll Down (two fingers)]</span>
            <div class="gradient-scrolly">
            </div>
            <div id="cred">
                First line of the credits - these are really cool on the full site<br>
                <span>Second credits line (also cool)</span><br>
                Not that cliche, kinda cool still
            </div>
            <div id="carousel" onmouseover = "carouselHovered()" onmouseleave = "carouselUnhovered()">
                <div class = "image">
                    A piece of art!
                    <img src="res/art.png"/>
                </div>
                <div class = "image">
                    A piece of art!
                    <img src="res/art1.png"/>
                </div>
                <div class = "image">
                    A piece of art!
                    <img src="res/art2.png"/>
                </div>
                <div class = "image">
                    A piece of art!
                    <img src="res/art3.png"/>
                </div>
                <div class = "image">
                    A piece of art!
                    <img src="res/art4.png"/>
                </div>
                <div class = "image">
                    A piece of art!
                    <img src="res/art5.png"/>
                </div>
                <div class = "image">
                    A piece of art!
                    <img src="res/art6.png"/>
                </div>
            </div>
            <div class="gradient-down" style="z-index: 1;position:relative;"></div>
            <div id="understuff" style="z-index: 2;position:relative;">
                <p>
                    A little piece on contributing to this site<br>
                    Some <b>rules</b> on submission<br>
                </p>
                <p>
                    <input type="text" id="urname" placeholder="Your name"></input><br>
                    <label id = "submitFile" for="submitFileInput">Upload your image</label>
                    <input type="file" id="submitFileInput" accept="image/png, image/jpeg"/><br>
                    <img id="filepreview" src="">
                    <button id="submitbutton" onclick="sendimage()" style="display: none;">Send</button>
                </p>
            </div>
        </div>
        <div id="shadowbox" class="hidden">
            <img src="foo"/>
        </div>
        <div id="submittedDongle" style="display: none">
            <span style="font-size: 1.3em;">Generic "your submission is complete" text!</span><br>
            Some explanatory text about your submission!
        </div>
        <script src="https://npmcdn.com/parse/dist/parse.min.js"></script>
        <script src="main.js">

        </script>
    </body>
</html>
```

It's still somewhat difficult to tell that the `#topstuff` div is missing a `</div>`, but it's much, much less so. And the only difference? Spaces, tabs, and newlines.

## 1-Interim.2: Where to newline

Now it's time to actually use some concepts! In the first chapter, we went through tabs, then newlines, then spaces (descending order of usefulness). Before we can go over tabs in this Interim, however, we have to go over newlines. In HTML there are two main "types" of element: Inline and Block. Inline elements are meant to be used in a sentence: such as, the `i` tag is used like this, `Hello world lorem <i>this is a pretty italicized Ipsum</i>`. We won't go over every inline element there is, but a rule of thumb: if it doesn't interrupt text, it's inline, if it pushes everything out of it's way and fills as much of the screen as possible, it's block. Obviously you don't want to interrupt your markup like this,

```html
hello
<i>world</i>
, how've you been?
```

so you don't want a newline for most inline elements. However, your markup quickly gets dirty if you don't use a newline for block elements like `p` and `div`, like

```html
<div><p>Hey there how've you been</p><p>Your uncle came down with the Jalapeno Blight? How awful!</p></div>
```

vs

```html
<div>
    <p>
        Hey there how've you been
    </p>
    <p>
        Your uncle came down with the Jalapeno Blight? How awful!
    </p>
</div>
```

So-

* If it's a block element, give the opening tag (`<div>`) and the closing tag (`</div>`) their own lines.
* If it's a block element, put the content inside on it's own line as well. Lines galore!
* If it's an inline element, don't use newlines at all - just stick those little bits of markup in your text like candies in a Halloween basket of spiders.
* If it's a block element, don't put any content on the lines of the opening and closing tag.
* Also, depending on what you're doing, you might want to add extra blank lines to separate similar groups of tags, to make it even cleaner.

That's the first step to cleaning up your code. Now on to tabs!

## 1-Interim.3: Tabs

Ah yes, our best friends the Tabs. These work after the newlines, so there's some pretty easy rules you can follow whenever you hit that enter button. (If your HTML editor does automatic tabs, open in a text editor like we did for Java in part 1):

* If you just opened a block-level tag: increase the tab level by one.
  ```html
  <p> <!-- The content inside the block-level P element is one tab up -->
      <span>An inline inside a block!</span>
  </p>
  ```

* If you just closed a block-level tag: decrease the tab level by one, *including on the line of the closing tag*.
  ```html
  <!-- this is what happens if you don't tab down -->
  <p>
      <span>This looks silly.</span>
  	</p>
  	<span>Yep. Still silly.</span>
  
  <!-- This is what happens if you do tab down, but do it wrong -->
  <p>
      <span>Less silly</span>
  	</p>
  <span>Still kinda silly</span>
  
  <!-- This is correct. -->
  <p>
      <span>Not silly at all!</span>
  </p>
  <span>Very serious!</span>
  ```

* If you opened or closed an inline tag, don't do anything at all - treat inline tags as normal text under most circumstances.

Easy, right? You'll notice that a lot of this is very similar to what we did in chapter 1 for Java - just replace the first line of a function (the declaration and `{`) with an opening tag, and the `}` with the closing tag, and the rules are the same!

## 1-Interim.4: Spaces and Wrapping Up

Most of the time in HTML you don't use spaces much. The best practice is mostly summed up by "don't use 'em", except inside the opening tag's declaration. I present to you the opening tag of the Carousel element from Not Art:

```html
<div id="carousel" onmouseover="carouselHovered()" onmouseleave="carouselUnhovered()">
```

`onmouseover` and `onmouseleave` are JavaScript events that I use to mess with scrolling, and `id` is a unique identifier for the element so you can mess with it in CSS and JavaScript. You'll notice that between every key-value pair<collapsible-footnote citationname="[1]">A key value pair is like a variable - a name (key) representing some data (value).</collapsible-footnote> there's a space, but there's no spaces around the `=`! That's sort of a code-style thing. Spaces around the = isn't too important for legibility so you can choose if you like them or not, but spaces between pairs are quite important.



I believe that's all! If you want more on the topic, W3schools is *not* recommended as their cleanliness is quite awful for introductory tutorials (and I can't vouch for the later ones), but [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML) near'bout always uses best practices so I recommend you read from there. We're still on track for basics of Where to use Functions and Where to use Classes next post (assuming I don't do more interim).

Keep coding and don't forget to use your tabs!