# Preface
I'll say upfront, I have a preference for unchecked exceptions, however, when I talk about error handling schemes, I like to view on how it affects the structure of the code, and not how it affects the binary and performance, as I see them as something tangential to error handling.  

While I have a preference to exceptions, not all implementations are the same. There are things I can like about in one implementation, but dislike in others, and this holds true for any error handling scheme.  

# Intro

I believe what makes a good error handling scheme from greatest to least importance is:

1. Distinct syntax (or lack of) to make it easier to see error handling is occuring
2. A compatible clean up routine
3. Tooling
4. Knowing if a function can error out and what errors they are

# Syntax
I think distinct syntax is the most important to error handling as error handling code that looks too much like normal code is more error prone. Case and point the most basic error handling syntax, if statements + return codes
```c++
void foo()
{
  //some code
  if()
  {
    //some code
  }
  //some code
  if()
  {
    //some code
  }
  //some code
}
```
Based on your experiences, you might've ran into functions structured like the above. Now the question is, is there any error handling going on? Yes? No? Maybe? Hard to tell without any real context, but the lack of context isn't the issue. The issue is that if statements have overloaded semantics. It could be:

- Detecting an error
- Propgating an error
- Handling and error
- Maybe jumping between non-error paths

Even with context, at first glance, it's just hard to tell. Contrast to other error handling schemes.
```c++
//exceptions
void foo()
{
  try
  {
    //some code
  }
  catch()
  {
    //some code
  }
}

//exceptions
void propogation()
{
  //some code
}

//Rust like results
void foo()
{
  match /*statement*/
  {
    OK() =>
    {
      //some code
      match /*statement*/
      {
        OK() =>
        {
          //some code
        }  
        Err() =>
      }
    }
    Err() =>
  }
}

//Rust like results
Result<void, E> propogation()
{
  let _ = bar()?;
}

//c++ expected
void foo()
{
  auto e = bar()
          .and_then([](auto){ })
          .and_then([](auto){ });
}
```

If we're talking general implementations, I like exceptions the most here. try / catch is so distinct that it's immediately noticeable that handling will occur. Propogation being implicit I'm ok with, if you have the ability to execute a piece of code regardless of how the function exits like C++ destructors.  
And the Result types are typically paired with monad operations, which basically hides the if statement with dedicated operations so that you can operate on just the value, or the error, depending on the state of the Result type.

If we're talking specific implementations, I think Rust's Result type is pretty genius with the '?' to propogate errors with minimal noise. That's how it should be when paired with a compatible clean up routine. Just clean up and bail out. C++ expected on the other hand would have you still rely on if statements in the event of needing to operate on multiple expected in the same scope.  
That being said, I think Rust's Results may run into the same issues as classic if statement error handling as they use pattern matching, which is also a general control flow construct, I don't know. I don't use Rust. Maybe it's fine due to it's exhaustive nature.
In some ways I prefer C++'s expected approach here because they are functions. Functions generally don't have any semantics attached to them. From the eyes of the caller, they just do something and then return and execute the next line. We create patterns to attach semantics to functions. In this case, semantics could be added to something like and_then, and becomes easier to distinguish when reading a function. Though you can also argue that functions are called a lot so they can blend in with the noise.

So in general, I'd rank from least to greatest

1. Exceptions
2. Results
3. If statements + return codes

If you imagine actual code placed inside these functions, then you get a visually noisy function. All functions get pretty noisy. However it becomes a problem if you can't distinguish the noise created from error handling, and just normal code like the most primitive error handling scheme, return codes + if statements. The issue lies in that if statements now have multiple semantics attached to it.



I like exceptions in this case. We can clearly see if we're handling an error if we have a try / catch. However all languages that have exceptions that I know of does not have a dedicated way of converting exceptions, so catch actually have 2 semantics tied to it. Handling, or rethrowing. Potentially 3 actually, but that's for later.

I also like Rust's ? for propagating for similar reasons of unchecked exceptions' propogation, it makes propogation simple and adds basically no noise to the function and that's fine as propogating means that the function doesn't care about the error, and just pass it along. On the other hand, I probably won't like Rust's pattern matching for handling errors as I'd assume that pattern matching will be used more frequently for things other than error handling. I don't use Rust, so I can only assume from things that I've heard. This would make error handling through pattern matching have similar issues to if statements for error handling.

# Compatible Clean Up Routine
An error handling scheme is nothing without a good compatible clean up routine. And I think a good clean up routine requires 2 things:

1. Executes regardless of how the function exits
2. Knows how far into the function has been executed.

If this routine executes regardless of how the function exits, you won't have to repeat the clean up code if you have multiple exit points. While knowing how far into a function is also important as without it, you'd have to write code and manually track it. Not to mention clean up would have to occur in a LIFO fashion. There's just lots of ways to go wrong.

Let's go through some examples starting with Java and C#'s take on exception implementation.  
For quite a few years in their respective languages they didn't have try with resources / using in their respective languagues. I couldn't find anything about finally, but imagine an exception implementation with only try / catch? You'd have to fill every intermediate function between the thrower and the catch that would clean up with try / catch so that they can properly clean up. Now you overload the semantics of catch statements to be either, rethrowing, handling, or clean up. Not to mention, if there are specific exceptions that you do want to handle specfically, you'd have to copy-paste the clean up code between them. That's a nightmare. Finally statement is a step in the right direction as you'd only have to place the clean up code in one place, however, now you have to write code detecting how far along the try block you are if there are multiple things to clean up, usually in a LIFO order. That's still a lot of ways to do things wrong.

C++'s destructors, I think, are the bare minimum best way to clean up code. They're called no matter how you exit the function*, and only when an object's lifetime begins, which means for exceptions, you no longer have to track how far into a try block code has been executed to figure out what needs to clean up. The ability to have code execute regardless of how a function exits is such a powerful tool because it also works well with basic return codes + if statements, and the likes of Result / expected kinds of error handling, which is why I think this is the bare minimum thing a language should have. Java and C# added a way to do it with try with resources and using, which in C# requires inheriting a interface for it to work. It's a work around but still acceptable.

*in C++, this only applies to objects living on the stack

I said that C++'s destructors are the bare minimum best way to clean up code, but what could be better?. I can only think for exceptions, in which case we should have "defers", which are great for one time clean up routines. Any language with destructor like functionality and storing lambdas would be able to simulate "defers". The next step above that are having scope guards like "scope exit" and "scope success", which executes their clean up routine only if an exception is in flight, or not in flight respectively. Having them in the tool box allows you to write code like this.

_Insert code example here_

And then one step farther, building on those abstractions to write code like this.

_Insert code example here_
