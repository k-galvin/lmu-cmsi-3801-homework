# Homework for CMSI 3801 Fall 2024

## Kate Galvin

### Homework 1: Scripting

In this assignment, I coded in Lua for the first time and got more practice with Python and JavaScript. This homework explored many topics including file processing, classes, and generators.

### Homework 2: Enterprise Languages

This homework assignment allowed me to refamiliarize myself with Java and get new exposure to Swift and Kotlin. I learned about object orientation and worked with classes, structs, and enums. I learned about the pros and cons of the different languages and their similarities and differences.

### Homework 3: Types

In this assignment I got more experience with TypeScript and worked in Haskell and OCamel for the first time. I learned more about types by working with type inference, type variables, typeclasses, and type annotations. I also got more exposure to functional programming.

## Testing Instructions

The test files are included in the repo already. They are available for YOU! They will help you not only learn the languages and concepts covered in this course, but to help you with professional practice. You should get accustomed to writing code to make tests pass. As you grow in your profession, you will get used to writing your tests early.

The test suites are run like so (assuming you have a Unix-like shell, modify as necessary if you have Windows):

### Lua

```
lua exercises_test.lua
```

### Python

```
python3 exercises_test.py
```

### JavaScript

```
npm test
```

### Java

```
javac *.java && java ExercisesTest
```

### Kotlin

```
kotlinc *.kt -include-runtime -d test.jar && java -jar test.jar
```

### Swift

```
swiftc -o main exercises.swift main.swift && ./main
```

### TypeScript

```
npm test
```

### OCaml

```
ocamlc exercises.ml exercises_test.ml && ./a.out
```

### Haskell

```
ghc ExercisesTest.hs && ./ExercisesTest
```

### C

```
gcc string_stack.c string_stack_test.c && ./a.out
```

### C++

```
g++ -std=c++20 stack_test.cpp && ./a.out
```

### Rust

```
cargo test
```

### Go

```
go run restaurant.go
```
