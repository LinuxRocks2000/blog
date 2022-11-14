---
title: "Web Development in C++"
bottomthing: "Building a minimal webserver in my favorite language"
published: false
---

Hello again, my dear coding padawans (and, you know, new visitors)! Today we're going to go through one of the more complex and interesting projects you can work on: building an HTTP server.

## What is this? What will I learn?

This post will go through all the necessary concepts to building a threaded webserver using modern c++ (and, in some cases, archaic C because the c++ equivalents are poorly made). This is not going to be another book, just a very, very long post, so the current progress at different steps will be shown throughout.

### Requirements

You definitely can't start this until you have a good grasp of C++ - classes and objects, pointers, and at least an understanding of the Standard Library (STD/STL). You'll also need a computer that can compile C++; this post will be written assuming Linux (I'm on Fedora but most instructions will work on Ubuntu as well) so you'll need to set up your own development environment if you're on Windows or Mac or indeed anything else.

Over the course you'll learn-

* Socket programming (network code)
* Files an