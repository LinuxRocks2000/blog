---
title: "Code Cleanliness part 1"
bottomthing: "A primer and serial internet book on code cleanliness, mostly written for the students of CS classes at Kennesaw State University"
---

# 1: Basics of Code Cleanliness

So I've been helping out around the Kennesaw State University (unofficial, I think) Discord server and one of the biggest issues I've seen is dirty code. Learning bad practices from the very start of your code career is nothing but harmful for you, so I've decided to put together a little 101 for code cleanliness.

To take a professorial voice, "what is code cleanliness?"

Code cleanliness is an intangible measure of how readable and understandable your computer program is. Clean code is easily read and edited not just by you but by other people, dirty code is difficult for other people (and perhaps yourself) to read and edit. This stretches into more than formatting - say you're using a specific number in 10 places all throughout a 10,000 line project, but each time divided or multiplied or otherwise mutated, how do you change the number? You could go through the code and debug until you find all of the occurrences of the number, perhaps taking hours of your time, or you can use a variable for it and change it only once.

If you're a new coder, you might be wondering what the point of code cleanliness is. I will admit a big benefit is that other developers can read your code - messy code is much, much easier to continue developing. You don't want to share a program and have another developer completely re-write it because it's unreadable and dirty (yes, this has happened to me).

Most languages have their own separate ways to keep clean. C-family languages (think C++, Python, JavaScript, and Java, amongst others) tend to rely on careful application of classes and objects for such things, and website code (HTML and CSS) is kept clean through clever ordering of elements and well-thought-out application of styles. However, there are several methods that apply to every language that I will go over here.

## 1.1: The importance of tabs

Tabulation is the first step in good code. Ideally you'll learn it as a muscle memory - tab, backspace, tab, backspace, all in order as you type. It makes it easier to see what block a line is in if you have proper tabulation (indeed, Python enforces it) and good tab practices can make a program significantly cleaner and more readable in general. Think of it like a book - most people keep their manuscript formatted as 12pt double spaced before they decide to publish and printing costs become a problem. This makes it easier to read so they can edit it and find typos and other mistakes. (At least, I assume this is what most people do. Most people aren't being very smart if they don't). I'm quite fond of analogies, but if you (as with most people) find it rather obtuse, here's a Java example of properly formatted code:

```java
public class Main{
    public Main(){
        System.out.println("Hello World");
        this.doFunction(1);
    }

    void doFunction(int operation){
        switch(operation){
            case 0:
                System.out.println("Verrrrrrry clever. Filling code with Switch/Case statements which are the dirtiest aspect of java."); // I'm not kidding, actually, switch/case is obtuse and dirty in any language
                break;
            case 1:
                System.out.println("Would you please stop filling code with switch/case statements?");
                break;
            case 2:
                System.out.println("I give up.");
                break;
        }
    }
}
```

And here's one of improperly formatted code:

```java
public class Main{
public Main(){
System.out.println("Hello World");
this.doFunction(1);
}

void doFunction(int operation){
switch(operation){
case 0:
System.out.println("Verrrrrrry clever. Filling code with Switch/Case statements which are the dirtiest aspect of java."); // I'm not kidding, actually, switch/case is obtuse and dirty in any language
break;
case 1:
System.out.println("Would you please stop filling code with switch/case statements?");
break;
case 2:
System.out.println("I give up.");
break;
}
}
}
```

This is bad enough already - now imagine there are randomly applied tabs in the wrong places, and the program is several hundred (or even thousand!) lines longer. So yeah. Tabs.

## 1.2: How to actually *use* the tabs

For this one, if you're using Intellij or similar you need to locate the file in a text editor like Notepad (Gedit, Kate, anything; editors like Atom are too smart). Intellij is immensely clever about automatic tabs which makes it much harder to learn. Write a couple lines and you'll probably find yourself wading in a sea of clean code with islands of unreadable blobs.

```java
public class Main{ // Written in an editor (it actually wasn't, but consider it a stand-in)
    public Main(){
        System.out.println("Hello World");
        this.doFunction(1);
    }

    void doFunction(int operation){
        switch(operation){
            case 0:
                System.out.println("Verrrrrrry clever. Filling code with Switch/Case statements which are the dirtiest aspect of java."); // I'm not kidding, actually, switch/case is obtuse and dirty in most any language
                break;
            case 1:
                System.out.println("Would you please stop filling code with switch/case statements?");
                break;
            case 2:
                System.out.println("I give up.");
                break;
case 3:
System.out.println("this part was written in a basic text editor");
break;
        }
    }
}
```

If you're editing code that already exists, you'll probably already see a pattern. Every time you use `{`, you have to tab up one. Every time you use `}`, you have to tab down one (including on the line with the `}`).  Case statements are a bit weird but basically after you have `case..something..:`, you tab up one, and when you have `break` you tab down one (**NOT** including on the line with the `break`). Statements - function calls, defining variables, etc, remain on the current tab level.

There's a bit of conflict over what form of tabs to use. It's generally accepted that a tab is 2, 4, or 8 spaces, but nobody's sure which one (4 is the most common and the one I recommend), and a slightly more controversial point is whether tabs should be parsed as individual spaces or large blocks (you'll see what I mean if you ever move your cursor over a tabulation in an editor. However, it is universally accepted that once you select one of these tab styles, you should stick with it. When tab styles change between lines, it generally makes code harder to read.

## 1.3: A code challenge

So far I've bored you with extended discussion and some blocks of my scrapped-together, probably nonfunctional Java. Now try a little challenge.

This is in C++ because it's my most comfortable language and it provides a bit of a challenge for newer coders who don't have any experience with it - remember, the same rules from the end of section 1.2 apply in this language as in Java. Answers below but under a 20 second timer wall (because I'm pretty annoying). Note that the only improper formatting will be tabs - we haven't gone over whitespace and newline yet, so you don't have to worry about those.

I'm not exactly testing you on this, but I do recommend you copy this into a text editor and fix it from there.

```java
#include <stdio.h>
#include <iostream>
#include <string>


std::string getHello(){ // A function that returns "Hello".
return "Hello";
	}

std::string getWorld(){
return "World";
}

	std::string getHappyString(){
	return getHello() + " " + getWorld();
}

int main(){
  std::cout << getHappyString() << std::endl;
}
```

<div class="timerwall" style="height: 120vh;" data-time="20"></div>

Here's the fixed version (with comments where it was altered):

```c++
#include <stdio.h>
#include <iostream>
#include <string>


std::string getHello(){ // A function that returns "Hello".
	return "Hello"; // Tab up (because of the { on the previous line)
} // Tab down (because these are always included in their own tabdown)

std::string getWorld(){
	return "World"; // Tab up (because of the { before)
}

std::string getHappyString(){ // Tab down (the tabulation level was at 0 because of the }s)
	return getHello() + " " + getWorld();
}

int main(){
	std::cout << getHappyString() << std::endl; // Delete the spaces and add a tab (two space tabs aren't wrong per se, but the document was already using four space tabs)
}
```

## 1.4: Newlines

Newlines and spaces are not *incredibly* important - generally as long as you use them they'll be fine - but you should at least be aware of them. In general, the important thing is that you choose something that works for you and makes some sense. Generally you don't have to worry too much about these in HTML, but CSS does have to deal with it.

The general rules I follow (which, I hope, follow real conventions) are...

* After a block of `#includes` or `imports`- 2 newlines. Not two after each (they should all be touching), but two after all of them together.
  ```plaintext
  import stuff; // Java, Python
  #include <stuff>; // C++


  // After TWO newlines, your code.
  ```

* After the final `}` (or just after the class in Python) of a `class`- 2 newlines, as long as it isn't the last class in the file. Any C-family language.
  ```plaintext
  class Thing{ // Java, C++
  	// stuff
  }


  // More code AFTER those two newlines
  class Thing: ## Python (note the ## instead of //! This tiny section is Python code.)
  	def __init__(self):
  		pass ## Stuff.


  // Even more code.
  ```

* After a function (including inside a class, as long as it isn't the last function)- 1 newline. Any C-family language as well.
  ```plaintext
  def programFunction():
  	pass ## Pythonnnnnnn!
  
  // 1 newline
  int main() {
  	// C++ and Java
  }
  
  // 1 newline
  fun function : int() {
  	// Kotlin (not going to have much kotlining, but it's a fun one)
  }
  ```

* After a variable (or block of variables) is defined (as long as it's NOT the last thing in a class)- I use 1 newline, but this is not exactly an enforced convention. You should just decide on how you like it. Sometimes I order blocks of similar variables together separated by newlines, sometimes leave them in a big mess together, etc. There are no real well-defined rules that I know of for this one. Just make sure whatever you choose is readable!

* At the end of the file - 1 empty line. This is a UNIX/Linux thing from the old days when program depended on it and doesn't apply with most modern programs but it's a best practice nonetheless. Linux is the future of computing (it'll almost certainly outlive Windows and Mac), so you'd best get used to it's quirks - the alternatives could be dead in your lifetime.

* Between CSS selectors - 1 newline.
  ```css
  .fake { /* A selector */
      background-color: red; /* A rule */
  }
  
  #moreFakeID {
      /* more rules */
  }
  
  p {
      /* rules for styling paragraphs */
  }
  ```

* Between rules in CSS - if you want, you can put some newlines in wherever it makes sense. There's no good conventions that I know of.

This is not a terribly solid concept - indeed, it's rather jiggly - so I'll attempt to provide some useful examples. Here's a program that follows all the practices I recommend - it's up to you to decide whether it's correct or not:

```java
import java.util.Scanner;


class Hitchhiker {
    private int number = 10;

    String helloFunction() {
        return "Hello";
    }
}


class Main {
    private Scanner scanner = new Scanner(System.in);

    private Hitchhiker douglasAdams = new Hitchhiker();

    public static void main(String[] args) {
        System.out.println("hi");
    }

    private int thing = 0;
}
```

Here's a version of the code that is somewhat wrong - not super wrong:

```java
import java.util.Scanner;
class Hitchhiker {
    private int number = 10;
    String helloFunction() {
        return "Hello";
    }
}
class Main {
    private Scanner scanner = new Scanner(System.in);
    private Hitchhiker douglasAdams = new Hitchhiker();
    public static void main(String[] args) {
        System.out.println("hi");
    }
    private int thing = 0;
}
```

Kinda hard to read, right?
You can also go too far on the other end, like so:

```java
import java.util.Scanner;




class Hitchhiker {


    private int number = 10;

    String helloFunction() {




        return "Hello";

    }

}




class Main {

    private Scanner scanner = new Scanner(System.in);



    private Hitchhiker douglasAdams = new Hitchhiker();

    public static void main(String[] args) {






        System.out.println("hi");

    }


    private int thing = 0;

}




```

Not nearly as hard to read but still unpleasant, and it takes up much more space, meaning it's harder to see the whole thing in one page, and the newlines aren't intelligent enough to guide you through the code.

## 1.5: Spaces

Let's go over some space practices. This is perhaps the *least* important part of basic formatting, so we can cover it fairly quickly. This is mostly for pedants and painters of programmatical portraits. These apply to most languages, CSS included, but I'll use Java for all the examples; most of it is simple enough that it'll fit directly in most languages.

Where to use spaces:

* Not in variable names. C'mon people. It won't understand.

* After the class name and before the `{`
  ```java
  class Test { // See?
  
  }


  class NotThatBad{ // No difference? Yeah.

  }
  ```

* After the `)` and before the `{` in function names
  ```java
  void fun1() { // See?

  }

  void fun2(){ // Eh.

  }

  void fun3()             { // No.

  }
  ```

* More important - Around logic operators. Like so,
  ```java
  10 == 10; // Spaces
  10==10; // No spaces.
  10 < 20; // Spaces
  10<20; // No spaces.
  30 > 15; // Spaces
  30>15; // No spaces.
  // There's others but you get the gist. If ever you end up doing ternary and need help with spaces - google it, the example will probably use the spaces properly. You'll be able to tell if it doesn't.
  ```

* Less important again - Before comments.
  ```java
  System.out.println("C++ too!"); // Space
  System.out.println("And Python!");// No space.
  System.out.println("And Javascript!");                // Too many spaces!
  ```

* After commas-
  ```java
  void function(int num1, int num2){ // Spaces
  
  }
  
  void function2(int num1,int num2){ // No spaces.
  
  }
  ```



## 1.6: Final Challenge (bringing it all together)

Here's a little Java challenge code for you to fix (should compile, won't do anything):
```java
class Thing{
public int number = 12;
void doThing()       {
  System.out.println("hello");
}
    void doOtherThing(){
      System.out.println("why must you keep creating these example functions?");
    }
}
class Main{
  public static void main(String[] args){
  System.out.println("UGH! No more! Stop it with these example functions!");
  }
  private int divide(int num1,int num2){
   return num1/  num2;
  		}
public int anotherNumber = 178;
}
```

<div style="height: 80vh;"></div>

Note: If you converted all the 2-space-tabs to 4-space-tabs, that was actually "wrong"! The prevalent style was 2-space-tabs. It's not like it really matters (and 4-space-tabs are easier to read in my opinion) but I consider it an interesting exercise in perspective.

In the next episode, we'll go over the basics of code organization: when to use functions, when to use classes, and why to use any of them. If I still have space (these chapters are going to be much smaller than PFS installments), I'll write in some basic bits on logic and optimization as well.

**See ya soon!**
