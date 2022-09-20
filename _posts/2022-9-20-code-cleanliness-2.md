---
title: "Code Cleanliness part 2"
bottomthing: "A primer and serial internet book on code cleanliness, mostly written for the students of CS classes at Kennesaw State University"
---

# 2: Efficient Code

**Diction note**: I'll be using the terms "compile" and "compiler" a lot over this chapter. A "compiler" takes something humans can read and edit easily (like a Java or C++ program) and converts it into something that computers can read easily (known as bytecode, if you ever open an EXE file in a text editor this is what you're looking at). To "compile" is to run a compiler on a program - you won't generally have to touch this much, because Intellij will compile and run for you. It's important to note that running a program (telling the computer to start reading and using bytecode) is very different from compiling!

Ok, ok, I lied. We aren't going over classes and functions today. We do still have a lot of topics to cover, however. Firstly we'll go over clean practices of when to use certain types of statement - when to use `if`, when to use `switch` (please don't use `switch`, it's immensely dirty), when to use `for`, when to use `while`, and how to use their various features to your benefit. If I have enough space, we'll also go over some thumb-rules on how to write code that compiles first try. This article will mostly not apply to web development - I'll write something for y'all CS 1300 folks soon, don't worry.

## 2.1: Switch, case, if, and else

These are four very similar syntactical constructs that you probably know well by now. If you don't, or want a quick refresher, remember that:

* `if` statements - check if something is true and run some code if it comes out to `true`
* `else` statements - if the last `if` statement's comparison came out to `false`, run some  code
* `switch` statements - take a comparison value and open a block of case statements
* `case` statements - check the parent switch's value against a test, if they're the same run some code

**Note**: Over this book I refer to `switch`/`case` as an ugly, dirty, and useless logic flow that can and should be replaced by the superior `if`/`else if`/`else`. The allure of `switch`/`case` is, however, undeniable - they allow you to shave off some work and match values in bulk. However, most of the time, unless you're using them very carefully, they just make code dirtier. An easy rule of thumb is- if you have a bunch (or plan to, planning is important!) of fairly uniform logic operations (only == is supported by `switch`/`case`) you want to check against a single value and do very simple operations, you should be using `switch`/`case`, but if you have ANY other situation you should not. An example is when I used a `switch`/`case` statement in Platformer for art, because styles are determined by a single value (a string), so it made it cleaner instead of the opposite.

`switch`es and `if`s are very very different statements. `if`s exist to do complex logic with every operator in the language - they can check less than,  greater than, equal to, or not equal to, as well as run functions to test their results for even more powerful logic. On the other hand, `switch` statements exist to do purely equality checks, although I must admit they're pretty good at it. So, you can extrapolate these general rules:

* Use `if` statements when you need to check if something is less than, greater than, or not equal to
* Use `switch` statements when you need to check if something is equal to
* Use `if` statements if want to compare against more than one variable
* Use `switch` statements if you're fine with comparing against one
* Use `switch` only if you have a large number (or think you might eventually have a large number) of checks to do
* Use `if` otherwise

Now, you can replicate most of `if`'s functionality with `switch`es, but that doesn't mean you *should*. Indeed, you should definitely avoid doing so. That makes code dirty. You want clean, concise, and efficient, not bloated. A C++ example of what you shouldn't do is,

```c++
#include <stdio.h> // Necessary for the program to actually run but you don't have to worry about it too much
#include <iostream>


int main(){
    int theySaid;
    std::cin >> theySaid; // Same idea as scan.nextInt(), now theySaid is equal to some piece of user input
    switch(theySaid > 50){
        case true:
            std::cout << "Your number is more than 50" << std::endl; // Just a printout.
            break;
    }
    
    switch (theySaid < 50){
        case true:
            std::cout << "Your number is less than 50" << std::endl; // Like System.out.println()
            break;
    }
    
    switch (theySaid){
        case 50:
            std::cout << "Your number is exactly 50! Hooray!" << std::endl;
            break;
    }
    
    return 0; // System-level stuff, don't worry about it
}
```

(This is verified to run). This technically works, but it's kinda stupid. It's bloated and does one more check than necessary. Observe the proper version (c++ still),

```c++
#include <stdio.h> // Necessary for the program to actually run but you don't have to worry about it too much
#include <iostream>


int main(){
    int theySaid;
    std::cin >> theySaid; // Same idea as scan.nextInt(), now theySaid is equal to some piece of user input
    if (theySaid > 50){
    	std::cout << "Your number is more than 50" << std::endl; // Just a printout.
    }
    else if (theySaid < 50){ // Else ifs are fun. Basically, if the last thing didn't return true and this next thing does return true, run some code.
    	std::cout << "Your number is less than 50" << std::endl; // Like System.out.println()
    }
    else{ // Runs if the last else-if didn't run.
        std::cout << "Your number is exactly 50! Hooray!" << std::endl;
    }
    
    return 0; // System-level stuff, don't worry about it
}
```

(Also verified). See, much cleaner! You don't have to manually check against `true`, and you can group it all together in one block to reduce the number of operations you do and make it so only one of the printouts ever happens under any circumstances. This all applies to Java as well - surely you've recognized some syntaxes. However, switch/case becomes useful in situations like this (Java because C++ is weird about strings in switch/case),

```java
import java.util.Scanner;


class Main {
    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);
        String input = scan.nextLine();
        if (input.equals("Hello")){
            System.out.println("Hello yourself");
        }
        else if (input.equals("Goodbye")){
            System.out.println("Where ya goin, city boy?");
        }
        else if (input.equals("Sausage is good")){
            System.out.println("Bacon is better");
        }
        else if (input.equals("Eggs and Biscuits are good")){
            System.out.println("What are you, Southern?");
        }
        else if (input.equals("Gravy and grits is best")){
            System.out.println("That's a good answer to my question");
        }
        else if (input.equals("Free market economies cause an underprivileged lower class")){
            System.out.println("I'm getting very mixed messages here.");
        }
    }
}
```

That's kinda painful. In this single case, it actually gets more efficient to use `switch`/`case`, like so:

```java
import java.util.Scanner;


class Main {
    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);
        String input = scan.nextLine();
        switch(input){
            case "Hello":
                System.out.println("Hello yourself");
            	break;
            case "Goodbye":
                System.out.println("Where ya goin, city boy?");
            	break;
            case "Sausage is good":
                System.out.println("Bacon is better");
            	break;
            case "Eggs and Biscuits are good":
                System.out.println("What are you, Southern?");
            	break;
            case "Gravy and grits is best":
                System.out.println("That's a good answer to my question");
            	break;
            case "Free market economies cause an underprivileged lower class":
                System.out.println("I'm getting very mixed messages here.");
            	break;
        }
    }
}
```

Both of these programs are verified to run.

You'll notice that if there were only a couple, instead of 6, you'd want to use `if`/`else`; `switch`/`case` is only efficient when you have a largish number of statements (a very experienced code teacher I'm friends with corroborates, by the way).

## 2.2: For Loops

Ah yes. Loops. I'm not certain how many of you know how to use these already - I'm assuming most CS students by now are acquainted with basic `for` loops, and maybe have heard of `while` loops. However, I've noticed that the class is doing somewhat of a poor job of teaching them, so let's go through `for` loops again. If you're pretty sure you don't need to read this part, read it anyways, because you can never be sure.

What is a for loop? A for loop is a way to run a piece of code a set number of times. It's structured rather like an `if` statement, but with a *lot* more where the condition goes. Generally they look something like this:

```java
for (int i = 0; i < 10; i ++){
    // Your code goes here
}
```

This doesn't tell you too much, however. So let's dissect it, Platformer from Scratch (my previous internet book, available on this website) style.

* `for (`: Tell the compiler to expect the iterator declaration of a `for` loop.

* `int i`: This is the *iterator variable*. Iterator variables increase in every iteration of the loop, so if you have

  ```java
  for (int i = 0; i < 5; i ++){
      System.out.println(i);
  }
  ```

  you'll print out all the numbers from 0 to 4. (Why is this? Loops are supposed to be 0-indexed. That means they start at 0 and stop 1 before the boundary. You have the same number of iterations, but the iterator variable is always 1 less than you might expect. If you get from 1 to 5, you're doing something wrong!)

* ` = 0`: Tell the compiler that the *iterator variable* should start at 0. You can make this whatever you want, but I can tell you that is not a good idea. Badly constructed `for` loops will eventually come back to bite you - I can tell you this from personal experience.

* `;`: Tell the compiler that you're done initializing (preparing) the iterator variable, and want to define the boundary. The boundary is like the condition of an `if` statement - when it evaluates to true, the for loop continues another iteration, but if it is ever false, the loop breaks.

* ` i < 5`: The condition of the `for` loop - if it's true, go on for another pass, and if it's false, break the loop. You can use any comparison operator in here, but the ones you'll mostly be using are `<` and `>` (if you use `<=` or `>=`, you're making a mistake! It won't hurt you too much in the Java class, but when you get out into professional stuff this will mess you up. Personal experience.)

* `;`: Tell the compiler you're ready to go into the final part, where you define the variable's change per iteration.

* `i ++`: The variable's change per iteration. This is usually going to be `i ++` (assuming your iterator variable is `i`), but anything is valid there - you could even subtract one every time, but you'll want to make the condition a `>` instead of a `<` so it doesn't get caught in an infinite loop.

From there you just put your code in curlies (`{}`) and you have a `for` loop!

## 2.3: While loops

There's a fair chance you haven't heard of `while` loops yet. They're basically `if` statements that continue running the code until the condition returns false - like a `for` loop without the iterator variable. The syntax (in most languages, actually, not just Java) is,

```java
while (condition){
    // Code that runs until condition is false
}
```

A good example is checking the validity of user input, like so:

```java
// Assume there's a class set up with a Scanner named scan and all
System.out.println("Question (Y/N): ");
String input = scan.nextLine();

while (!input.equals("Y") && !input.equals("N")){ // The check runs over and over again, so you can just change the value of input and if it's valid the loop breaks
    // While the input isn't Y and the input isn't N
    System.out.println("Please give Y or N: ");
    input = scan.nextLine(); // Prompt again.
}

System.out.println("Thank you for your response!");
```

(verified correct)

Running this will give something like,

```plaintext
Question (Y/N): 
L
Please give Y or N: 
Z
Please give Y or N: 
n
Please give Y or N: 
Y
Thank you for your response!
```

You don't have to use nested ifs or break the program, you can just hang until they provide useful data! More advanced implementations of this are of course possible, but I won't get into those. 

**Note**: Be aware of `while` loops! They can and will hang your program forever (infinite loop) if for some reason the condition is never false.

That wasn't so bad! If you need more on while loops, I think a good Google query is `Java while loop` (replace "Java" with whatever language you're in; HTML and CSS don't have them so don't bother with those).

## 2.4: When to actually use For and While + Miscellaneous stuff

I think the situations in which you might want to use a `for` loop or a `while` loop are fairly obvious, but choosing which one might be more difficult. In general, you use `for` if you need an iterator and `while` if you don't; here's a list of thumbs:

* If you need to have an iterator variable that *increases linearly* use a `for` loop
* If you don't need an iterator variable use a `while` loop (note: it counts as needing an iterator variable if you want something to happen a set number of times, like a `for` loop where you don't use `i` in the code)
* If you want to iterate over something (like run a piece of code for every element in an array) use a `for` loop bounded by the length of the array. Be careful! If you don't use the for loop construction practices outlined in 2.2, you'll probably end up with broken code. Yep, personal experience.
* If you want to run a piece of code forever (like in game development, it's called a mainloop), use `while (true)`, unless you want to count ticks in which case you can use a for loop with a `true` condition, as opposed to `i < something`. (Note: some languages don't want you writing your own mainloops and prefer that you use some functions they provide - such as, you should **never** use `while (true)` in ECMAScript/Javascript).
* If you only want to run something once based on a condition, you should be using an `if` statement.
* If you want to run something a set number of times, but only actually do anything if some condition is filled, you should use an `if` statement inside a `for` loop.



Because this was a fairly short section, I'll also include some bonus miscellaneous information.

* Semicolons (Java, C++, Javascript, any C family language really): The rule of thumb is that there's a semicolon after every line not ending with `{` or `}`. If you're one of those people who always puts `{` and `}` on their own lines (eww, by the way), then this rule of thumb is *way* harder to effectively quantify - imagine that little newline before the `{` doesn't exist.
* `private`, `public`, and `protected` (largely Java): These are painful to work with and you shouldn't worry about them too much until later on, but remember that if something is used from another class it should be `public`, and if it's only used internally `private`. `protected` prevents access by classes from other packages - useful if you're writing a library.
* `static` (C++, maybe Java): Static means that a property cannot be inside an object, and is instead under the class. So instead of `myObj.method()` it's `MyClass.method()`. Useful if you want a class to have helper functions and objects at the same time.
* `const` (C++, maybe Java, Javascript): The value cannot change - is immutable. Keeps bugs away because you'll get in trouble if you try editing it, if you're in a big project you want to make as many things `const` as possible.



Well, that was a quick chapter! I hope you find it at least marginally useful. 

The next installment will *probably* be for HTML and CSS, such as how to keep them clean, efficient and minimal. This is a very large and difficult topic so it's probably going to be a very large and difficult chapter. If I don't post before this Friday afternoon, it won't be out until the weekend after next, as I'll be out-of-state for a week.

**See ya soon, and keep coding!**