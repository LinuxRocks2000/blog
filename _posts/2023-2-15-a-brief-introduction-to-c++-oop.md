---
title: A Brief Introduction C++ Object Oriented Programming
bottomthing: Perhaps the coolest object oriented language I have ever seen
published: false
---

As most readers of my blog will probably agree, C++ is a dang awesome language. It is fast (blazing. Fast.), it's easy to learn and to use, it scales to very large projects, and people who write good code are rewarded with code that works really, really well. It is also almost completely backwards compatible with C, so you can use kernel-level APIs in an object oriented context *and* can do hacky crap with pointers, if you feel like it (although please don't: that's how you get what we call segmentation faults).

Object oriented programming in C++ was the original goal of the language, and it just keeps getting better and better. Features like `auto`, templates, virtual interfaces, and concepts allow C++'s static typing to work really, really well and keep us protected from undefined errors. And of course, that's what this article is about!

This post makes use of c++20 features. If you're using g++ from command line, you can probably use c++20 with `-std=c++20` or `-std=gnu++20` (whichever you prefer). If you *can't*, you have a very old compiler and are probably on a very old system; you should go about fixing that before you follow this.

Note: this post assumes knowledge of object-oriented c++ concepts and knowledge of abstractions like enums.

## 1: Inheritance

Inheritance is the most basic aspect of C++ object oriented programming, except, perhaps, objects and classes themselves. It is, simply, when a class is used to extend another class. The simplest usage is like this:
```c++
#include <iostream>


class Animal {
	public:
    void Eat() {
        std::cout << "yum" << std::endl;
    }
};

class Dog : public Animal {
    // The public part signifies that functions defined in Animal will be externally accessible, so you can call Dog::Eat
    // Try removing it and compiling the code, and you'll get errors!
    public:
    void Run() {
        std::cout << "zoom" << std::endl;
    }
};


int main(){
    Dog d;
    d.Eat();
    d.Run();
}
```

If you compile and run, you'll see that it prints out both "yum" and "zoom"! This is because Dog is an Animal, and all Animals can Eat. 

### 1.1: Polymorphism and Interfaces

One feature of Inheritance is that objects of the child class can be used as objects of the base class (although there are some caveats, we won't be getting into those here) - *and overloaded functions are preserved*. So the following works perfectly:

```c++
#include <iostream>


class Animal {
	public:
    virtual void Eat() { // Virtual allows for polymorphism - the function can be changed by child classes, and then the new object can be used as an Animal.
        // If you get rid of virtual, it will still compile, but your code will print out "yum" instead of "the dog is eating"
        std::cout << "yum" << std::endl;
    }
};

class Dog : public Animal {
    // The public part signifies that functions defined in Animal will be externally accessible, so you can call Dog::Eat
    // Try removing it and compiling the code, and you'll get errors!
    public:
    void Eat() {
        std::cout << "the dog is eating" << std::endl;
    }
};

int main(){
    Animal* d = new Dog();
    d -> Eat();
}
```

And it prints out "the dog is eating"!

Note: if you get rid of the `virtual` bit, your code will compile fine, but instead you'll only see "yum" printed out. This is because, if functions aren't virtual, they're looked up by type instead of by object and `d` is an Animal* instead of a Dog*.

Polymorphic code is when you define a base class like Animal and then subclass it to add functionality. A better example is a simple motor controller compatibility library:

```c++
class BaseMotor {
public:
    virtual void SetPercent (float percent) = 0; // = 0 signifies that the virtual function is not implemented but will be implemented in a base class - they are "pure".
    virtual void SetPosition (float position) = 0;
};
```

Now we can overload this for, say, a simple servo motor, like so:

```c++
class ServoMotor : public BaseMotor {
public:
    void SetPercent (float percent) {
        std::cout << "Running motor at " << percent << std::endl;
    }
    
    void SetPosition (float position) {
        std::cout << "Moving motor to " << position << std::endl;
    }
};
```

And finally use it like,

```c++
int main(){
    BaseMotor* m = new ServoMotor;
    m -> SetPercent(0.5);
    m -> SetPosition(100);
}
```

Congratulations, you have a polymorphic interface!

There are some situations in which we want a polymorphic base class to provide functions instead of just placeholders. Since BaseMotor is a class, we can just add those functions!

```c++
// Global scope
enum Mode {
    PERCENT,
    POSITION
};

class BaseMotor {
    // ...
	void Set (Mode mode, float data) {
		if (mode == PERCENT){
    		SetPercent(data);
    	}
	    if (mode == POSITION){
        	SetPosition(data);
    	}
	}
}
```

Now, `m.Set(PERCENT, 0.5)` is equivalent to `m.SetPercent(0.5)`, and has the same result!

### 1.2: Multiple Inheritance

Multiple inheritance is when a class inherits from more than one parent. Sound cool? It is.

Say you have two classes, an InternetConnection class that does spooky things to send data over an internet connection, and a Point class which represents a point on the Cartesian plane, and you want to make it so Points are shared over an internet connection.

```c++
#include <iostream>
#include <string>


class InternetConnection {
public:
    void SendMessage(std::string message){
        std::cout << "Sending message " << message << std::endl;
    }
};


class Point {
    int x;
    int y;
public:

    void Set(int _x, int _y){
        x = _x;
        y = _y;
    }
};
```

You could go about it with a class like this,

```c++
class NetworkPoint {
    Point p;
    InternetConnection n;
public:
    void Set(int _x, int _y){
        p.Set(_x, _y);
        n.SendMessage("Changed the point's value to " + std::to_string(_x) + "x" + std::to_string(_y));
    }
};
```

Which works well enough. But say you want to add a feature to Point that returns the Pythagorean distance from 0, like

```c++
class Point {
public:
    // ...
    float GetDistanceFromZero(){
        return sqrt(x * x + y * y); // Need to include cmath.h for sqrt()
    }
};
```

How do you implement this in NetworkPoint? Well, it would be easy enough to add, just

```c++
class NetworkPoint {
public:
    // ...
    float GetDistanceFromZero(){
        return p.GetDistanceFromZero();
    }
};
```

But now you have to repeat that process every time you want to extend Point! Your code will quickly become unmaintainable.

The clean way to handle this is with inheritance. So just make NetworkPoint inherit from Point and keep an InternetConnection!

```c++
class NetworkPointV2 : public Point {
    InternetConnection n;
public:
    void Set(int _x, int _y) { // Note that Set in Point isn't virtual. Thus a NetworkPoint can't be used as a Point! It is not polymorphic.
        Point::Set(_x, _y); // Call the base class function - we still want set to work properly
        n.SendMessage("Changed the point's value to " + std::to_string(_x) + "x" + std::to_string(_y));
    }
};
```

At this point you must make a design decision. If it's necessary to interact with InternetConnection apis from outside when working on a NetworkPointV2, eventually you'll need to start writing functions that call InternetConnection functions. Your code gets dirty. It's time to use multiple inheritance!

(Also, remember, it's not always appropriate to use multiple inheritance, such as if you don't want every api exposed. Use discretion!)

```c++
class NetworkPointV3 : public Point, public InternetConnection {
public:
    void Set(int _x, int _y){ // Note that Set in Point isn't virtual. Thus a NetworkPoint can't be used as a Point! It is not polymorphic.
        Point::Set(_x, _y);
        SendMessage("Changed the point's value to " + std::to_string(_x) + "x" + std::to_string(_y));
    }
};
```

*Much* better! Now every time you add a public function to Point or InternetConnection, NetworkPointV3 will gain that function.

## 2: Templates

Templates are an excellent way to make library code more efficient. They allow you to create new types based on any static field passed into a class - a fancy way of saying they change the behavior of the class. An example of a templated class is,

```c++
template <typename FirstType, typename SecondType> // Take two template values. Think of it like a function definition - typename is the type of each argument. Typename refers to any valid c++ type.
// Be very careful never to add a semicolon between the template bit and the struct/class bit! It's a very embarrassing compile error.
struct Pair {
    FirstType first;
    SecondType second;
};
```

Pair is now a *templated type*. It doesn't have any kind of meaning on it's own, and you can't create an object of Pair, but if you feed it two types you create a valid class!

```c++
Pair p; // Compiler error
Pair <int, double> p2; // Valid pair with an int FirstType and a double SecondType
```

Hold on. What? Why is `Pair` not valid but `Pair <int, double>` is?

C++ is a *statically typed* language. That means, among a lot of other things, that the size and byte structure of all classes has to be determined at compile time and if it tries to change there's an error! Since templates choose what types are actually used inside a class, the compiler gets angry if the template type isn't specified. Pair is an incomplete type! When you specify the template values, you're not passing arguments, you're actually filling in the type itself.

```c++
Pair <int, double>; // Is equivalent to
struct Pair {
    int first;
    double second;
}; // Assuming you're on a system with 32-bit ints and 64-bit doubles, this type now takes up 96 bits, or 12 bytes.

Pair <char[6], int>; // Is equivalent to
struct Pair {
    char[6] first;
    int second;
}; // 10 bytes - 4-byte int + 6 byte array
```

Because templates are basically new types, templates of the same class are not compatible types.

```c++
Pair <char[6], double>* incompatible = new Pair <int, std::string>;
```

This may seem counterintuitive, but consider that this is basically saying,

```c++
struct CharDoublePair {
    char[6] first;
    double second;
};

struct IntStringPair {
    int first;
    std::string second;
};

CharDoublePair* incompatible = new IntStringPair;
```

A usage of templates that you've surely seen before is with managed arrays, like `std::vector`s. An `std::vector <int>` is just a Python-style list of ints; this is using a template!

```c++
template <typename T, int length> // this isn't particularly useful, but it serves as an example
class ArrayOf {
public:
    T array[length];
};
```

What's this? `int length` as a template parameter? Yep. Templates can also be basic types (like ints) or, with c++20 (which you really should be using whenever possible), any type at all! Because template parameters are automatically constant, you can do stuff like arrays sized by a template. Kewl!

### 2.1: Fancy stuff with templates

Say you're making a [linked list](https://en.wikipedia.org/wiki/Linked_list). You'll need to have a cell type which contains your data and a pointer to the next cell, and a container type that initializes all the cells. The C style way is with `void*` pointers, which is like walking willingly into the Cave in which Segfaults Lie without a lantern. In C++, we have templates! However, there's a problem. You don't want to have to specify `Container<Cell<MyType>>` as your template for the list container - that's just plain dumb, so how are you going to do this? If you think the answer is passing the template parameter to each cell, you're right.

```c++
template <typename T>
class Container {
    Cell <T>* first;
};
```

By the way - yeah, nested templates work. `Container<Cell<MyType>>` couldn't work without some fancy concepts, but things like this are possible:

```c++
template <typename FirstType, typename SecondType>
struct Pair {
    FirstType first;
    SecondType second;
};

template <typename T, int length>
class UselessArray {
    T array[length];
};

UselessArray <Pair <int, char[6]>, 6> arr;
```

If this looks stupid, it's because it is. However, this sort of thing is why `std::map` works!

You can also use templates with functions, which behave similarly to template classes. For example, a simple `new` implementation using templates,

```c++
template <typename T>
T* createNew(){
	T* ret = (T*)malloc(sizeof(T)); // Syscall to allocate a block of memory size T
    memset(ret, 0, sizeof(T)); // Zero it, so we don't leave junk data in T
    return ret;
}
```

Can now be used like,

```c++
template <typename T, int length>
class UselessArray {
    T array[length];
};

UselessArray <char, 10>* arr = createNew <UselessArray>();
```

Fun!

As with templated classes, you can also pass constant values to templated functions.

```c++
template <typename FirstType, typename SecondType>
struct Pair {
    FirstType first;
    SecondType second;
};

template <typename T, char b>
void fancyMemset(T* in){
    memset((char*)in, b, sizeof(T));
}

Pair <char, char> p = { 'h', 'i' };
fancyMemset<Pair<char, char>, 'l'>(&p); // and now p is { 'l', 'l' }, because every byte has been set to 'l'.
```

Generally useless, but mocking C developers has never been this easy.

## 3: Concepts

Now we gettin' to the good part! Concepts are a fancy-schmancy C++20 feature that allow you to define a set of rules that classes have to conform to, and then through some kind of magic *use those parts of any class*.
