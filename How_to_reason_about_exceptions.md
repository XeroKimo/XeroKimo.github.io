## Preface

I am not here to tell you whether exceptions are better or not. This could honestly be called how to reason about error handling as most of the content can be applied to any error handling scheme you use, but I'd like to focus on exceptions as they are my favorite ways to handle errors and hopefully shed some light on how to be able to reason in a code base which uses exceptions. There are a lot of resources about how to use exceptions, but not a lot on how to reason about them beyond the basics of what occurs when you throw them. This post does assume you have basic understanding of how exceptions work.

Let's assume that we're in a codebase that only uses exceptions for error handling, even more horrifying, let's assume we only have access to unchecked exceptions. How can we possibly tell what can error? How do we reason about the function's control flow? Actually, can we reason about anything in the codebase? We can, but first, let's have a quick rundown of the semantics of error handling.

## Quick Error Handling Rundown
There are 4 semantics attached to error handling

1. Detection
2. Propagation
3. Handling
4. Clean Up

Detection is to find some erroneous behaviour and report it. Let's say it reports an error object.

Propagation is to pass along this error object to a place it can be handled.

Handling is to perform some action based on the error object and end its lifetime. So long as an error object exists, the error is not handled. That means converting it from one error to another or rethrowing is also not handling.

Clean up is to make sure that nothing in the call stack leaves any part of your program in a errorneous state while the error object is propagating. Clean up is not necessairly part of error handling as it is something you should be doing regardless of whether an error can occur or not.

It is important to note that Propagation is not Handling the error. I've seen some comments saying something along the lines of "Yea I've handled the error look" `if (error) return error;`, but that's propagating as the error still exists, but maybe that's just a vocal minority. 

With that out of the way, how do we write and read code with exceptions and still be able to reason about it?

## What can possibly error?
People who like exceptions tell you to just accept that every function can throw. While there are truths to that, it just sounds more like a burden to me. Some people who like exceptions might point you toward checked exceptions. Now you know what functions can throw, and what those errors are, just like value-typed error schemes, but our hypothetical codebase only uses unchecked exceptions, now what?

## The different ways we handle errors
When we decide to handle errors, they are handled in 1 of 4 ways, split between whether we care about the exact errors or not, and whether we care about the exact operations or not. 

|Error V/ Operation ->|Exact|Not Exact|
|---|---|---|
|Exact| [Examples](https://godbolt.org/z/TdP5dPf56)  | [Examples](https://godbolt.org/z/9x3vc6G3M) |
|Not Exact| [Examples](https://godbolt.org/z/zoY1xofT1)  | [Examples](https://godbolt.org/z/8qsbsneY7) |

These examples is non exhaustive and are only there to get an idea of how some functions which handle errors are written.

The amount of error handling code in a code base is already pretty small, but based on the above specifications, the frequency of the ways we handle errors are not equal. From most frequent to least.

1. Error Not Exact, Operation Not Exact
2. Error Not Exact, Operation Exact
3. Error Exact, Operation Not Exact
4. Error Exact, Operation Exact.

Exceptions excel in the most common way we handle errors, when we don't care what the exact error was, and not care what the exact operation is. So the answer for what can possibly error? The answer; We don't know, but at the same time, majority of the time, we don't care. We only care about *when* our function fails, not if any individual operation can fail. It is basically saying the same thing as every function can throw, but I think flipping to this perspective makes things more approachable.

If your function can never fail, but you still wrote error handling code, it's one of those things that are better safe than sorry to have until you can prove that this function 100% can't fail and the error handling code doesn't cause any issues.

So what if we aren't in the majority? Luckily, so long as we don't care about the exact error, unchecked exceptions work just fine through some techniques shown in the examples, but the moment we care about the exact error is when you can only hope things are documented properly. Potentially, we could have a tool which auto-generate a list of exceptions that the function throws, either for documentation, or for other tools to consume and display this information in some way, that way, one doesn't need to manually update the list in a human error prone way, but if we really care about handling exact errors, it's best we just play to the strength of other error handling schemes.

## Simplifying Functions
My previous point made an assumption "*when* our function fails". This has been a personal guideline of mine when writing exceptions which simply states, "either your entire function is surrounded by a try / catch block, or it doesn't have one at all". Doing so might force you to simplify your function by properly splitting things apart as trying to reason about big functions is hard enough. Reasoning about a big function that can fail is even harder.

Going forward, I will be assuming our functions are written like so.

## Reasoning About Control Flow. A Different Mind Set
Let's say we have a function we have to implement. We've figured out what we need to implement it so we start writing it out. This is how it might go without exceptions.
1. Write some code
2. Oh, this operation can error? Immediately think about either propagating or handling, and clean up
3. Repeat Step 1 until function has completely written

Then when someone else comes along to read or review this function, they'll basically do the exact same steps to ensure the correctness of the function.
1. Read function starting from the top, making our way down
2. Notice this call errors, reads the correctness of the propagation or handling code
3. Repeat until we've read everything

People like that as we can see all the places a function can exit, however the amount of exit points hardly matters. What matters is that did we exit the function because it succeeded, or because it failed? And if we exited the function because we failed, what matters is we cleaned up properly and propagated the error object. The mind set of writing with exceptions reflects this.
1. Write the function as if it doesn't error, aka the happy path
2. Write clean up code
3. Decide if we want to handle any errors, if yes, put a try/catch on the entire function
4. Write clean up code for the error paths if there are any

Reading is of course done the same way
1. Read the happy path
2. Ensure the clean up code is written corretly
3. Read the error paths if the function actually handles any errors

How can we write clean up code if we don't know the exact functions that can error?

## The different ways we clean up

Knowing what clean up code to write has the same pains regardless of the error handling scheme you use. You need knowledge of what your operations are actually doing to know whether or not you need to call something else to properly clean up, or rely on documentation, otherwise you'll have a memory leak or have parts of your program in some unknown invalid state. The only thing that makes exceptions a bit harder is not being able to rely on all the same explicit clean up techniques value-based error handling uses.

Here are some techniques that can be deployed which makes it much simpler for the user to write clean up code correctly and are also error handling scheme agnostic.

### If you're calling a function, ideally it returns some type that knows how to clean up after itself
```c++
void Func()
{
    std::unqiue_ptr<Foo> foo = SomeAllocatingFunction();
    //Do operations
}
```
Here `foo` cannot be forgotten to be deleted as `std::unique_ptr` will call delete in its destrutor. This is one of the least error prone techniques because the only thing the user has to do is to store the variable within the scope, which in most cases, is something a user will actually already do as they will probably be using it soon. No need for the user to remember to call some paired operation to properly clean up as it's already written in a class's destructor.

### If your language supports composing functions, you could pass in a function to operate on some value, and the higher order function will be responsible for cleaning up
```c++
void Func()
{
    database.Write("Key", [](auto& value)
    {
        //modify value and do some operations
    });
}
```
In this example, `Write()` could maybe perform a rollback if the passed in function fails so we could modify the value without any worries of it becoming some invalid value. This is the least error prone way to do clean up assuming you're using a compatible error handling scheme with the function you're calling with. For example, if `Write()` expects to use value-based errors, throwing an exception will completely break this safety.

### Commit on success
```c++
void Foo::Func()
{
    auto temp = SomeValue();
    //Do operations
    member_variable = temp;
}
```

This technique is the simplest of them all, no need for fancy language features. If you make changes using a temporary variable, it doesn't matter how you change it, no visible state gets changed until you assign it back to the more permanent storage

### If your language doesn't support something like destructors, but supports defer, write a defer statement after the operation you need cleaning up.
```c++
void Func()
{
    Foo* foo = SomeAllocatingFunction();
    defer([foo]{ Free(foo); });
    //Do operations
}
```
Defer is an operation that runs when we exit the function, regardless of how we exit it. Some times however, you might not want that. Some times you only want the defer to execute on failure. In C++, these are commonly called as scope guards. Defer is just one kind of scope guard. There's also a scope guard that can run only when on failure, and one only on success. Defers can basically be seen as function specific destructors. It makes it less error prone for clean up with the downside of every function which operates on something that needs the pair function be called for clean up be written in every function instead of doing it once by creating a class with a destructor. <br>This is the only technique that would require the user to have knowledge of the paired operation, while all the other techniques are just completely hidden away from you making this technique less safe as you could forget about it, but at least you could only forget it once compared to forgetting at every potential function exit point

These are just some of the ways we could write clean up code, mostly without the user requiring knowledge of how to properly clean up.  Most of these techniques assume the abstraction has already been written. If you need to make those abstractions yourself and the clean up code has bugs, at least the bug is centralized.

## Conclusion
So how do we reason about exceptions? It just really boils down into writing code with the intent of what we want it to do, and not the exact how, which is basically every abstraction ever. It is done by simplifying our functions. By caring only about whether our function fails or not rather than concerning if any individual operations can fail. By making sure the clean up code works regardless of how we exit the function. And lastly, just approaching the code with a different mind set where what the function achieves is more of the focus then the ways of exiting the function.