import './App.css'
import {  JSX  } from 'react'

function App() : JSX.Element {

  return (
    <>
    <p>
      <h1>How to reason about exceptions</h1><br/>
      Publish Date: 2024 Sept 2<br/>
      Last Updated: 2025 March 3<br/>
    </p>

  
    <p><h2>Preface</h2><br/>
      I am not here to tell you whether exceptions are better or not. This could honestly be called how to reason about error handling as most of the content can be applied to any error handling scheme you use, but I'd like to focus on exceptions as they are my favorite ways to handle errors and hopefully shed some light on how to be able to reason about codebases which uses exceptions. There are a lot of resources about how to use exceptions, but not a lot on how to reason about them beyond the basics of what occurs when you throw them. This post does assume you have basic understanding of how exceptions work.
      <br/><br/>
      Let's assume that we're in a codebase that only uses exceptions for error handling, even more horrifying, let's assume we only have access to unchecked exceptions. How can we possibly tell what can error? How do we reason about the function's control flow? Actually, can we reason about anything in the codebase? We can, but first, let's have a quick rundown of the semantics of error handling.
    </p>
    <p><h2>Quick Error Handling Rundown</h2><br/>
      There are 4 semantics attached to error handling
      <br/><br/>
      1. Detection
      2. Propagation
      3. Handling
      4. Clean Up
      <br/><br/>
      Detection is to detect some erroneous behaviour and report it. Let's say it reports an error object. Propagation begins the moment we leave the current stack frame with the error object. If we handle the error within the same stack frame the error was detected in, propagation is skipped.
      <br/><br/>
      Propagation is to pass along this error object up the call stack to a place it can be handled. How it arrives there, it doesn't matter. Implicit, explicit, the behaviour is all the same
      <br/><br/>
      Handling is to perform some action based on the error object and end its lifetime. So long as an error object exists, the error is not handled. That means converting it from one error to another or rethrowing is also not handling.
      <br/><br/>
      Clean up is to make sure that nothing in the call stack leaves any part of your program in a errorneous state while the error object is propagating. Clean up is not necessairly part of error handling as it is something you should be doing regardless of whether an error can occur or not.
      <br/><br/>
      It is important to note that Propagation is not Handling the error. I've seen some comments saying something along the lines of "Yea I've handled the error look" `if (error) return error;`, but that's propagating as the error still exists, but maybe that misunderstanding is just a vocal minority. 
      <br/><br/>
      With that out of the way, how do we read and write code with exceptions and still be able to reason about it?
    </p>
    <p><h2>What can possibly error?</h2><br/>
      People who like exceptions tell you to just accept that every function can throw. While there are truths to that, it just sounds more like a burden to me. Some people who like exceptions might point you toward checked exceptions. Now you know what functions can throw and what those errors are, just like value-typed error schemes, but our hypothetical codebase only uses unchecked exceptions, now what?
    </p>
    <p><h2>The different ways we handle errors</h2><br/>
      When we decide to handle errors, they are handled in 1 of 4 ways; split between whether we care about what the exact errors are or not, and whether we care about the which exact operations caused the error or not. 
      <br/><br/>
      |Error V/ Operation -{'>'}|Exact|Not Exact|<br/>
      |---|---|---|<br/>
      |Exact| <a href = "https://godbolt.org/z/TdP5dPf56">Examples</a>  | <a href = "https://godbolt.org/z/9x3vc6G3M">Examples</a>  |<br/>
      |Not Exact| <a href = "https://godbolt.org/z/zoY1xofT1">Examples</a> | <a href = "https://godbolt.org/z/8qsbsneY7">Examples</a>  |<br/>
      <br/>
      These examples is non exhaustive and are only there to get an idea of how some functions which handle errors are written.
      <br/><br/>
      The amount of error handling code in a code base is already pretty small, but based on the above specifications, the frequency of the ways we handle errors are not equal. From most frequent to least.
      <br/><br/>
      1. Error Not Exact, Operation Not Exact
      2. Error Not Exact, Operation Exact
      3. Error Exact, Operation Not Exact
      4. Error Exact, Operation Exact.
      <br/><br/>
      Exceptions excel in the most common way we handle errors, when we don't care what the exact errors were, and not care which exact operation caused it. So the answer for what can possibly error? The answer; We don't know, but at the same time, we don't care, majority of the time we only care about *when* our function fails, not if any individual operation can fail. It is basically saying the same thing as every function can throw, but I think flipping to this perspective makes things more approachable.
      <br/><br/>
      If your function can never fail, but you still wrote error handling code, it's one of those things that are better safe than sorry to have until you can prove that this function 100% can't fail and the error handling code doesn't cause any issues.
      <br/><br/>
      So what if we aren't in the majority? Luckily, so long as we don't care about the exact error, unchecked exceptions work just fine through some techniques shown in the examples, but the moment we care about the exact error is when you can only hope things are documented properly. Potentially, we could have a tool which auto-generate a list of exceptions that the function throws, either for documentation, or for other tools to consume and display this information in some way, that way, one doesn't need to manually update the list in a human error prone way, but if we really care about handling exact errors, it's best we just play to the strength of other error handling schemes.
    </p>
    <p><h2>Simplifying Functions</h2><br/>
      My previous point made an assumption "*when* our function fails". This has been a personal guideline of mine when writing exceptions which simply states, "either your entire function is surrounded by a try / catch block, or it doesn't have one at all". Doing so might force you to simplify your function by properly splitting things apart as trying to reason about big functions is hard enough. Reasoning about a big function that can fail is even harder.
      <br/>
      Going forward, assume our hypothetical codebase always follows the guideline as this post has always assumed the functions written follows the guideline.
    </p>
    <p><h2>Reasoning About Control Flow. A Different Mind Set</h2><br/>
      Let's say we have a function we have to implement. We've figured out what we need to implement so we start writing it out. This is how it might go without exceptions.
      <br/><br/>
      1. Write some code<br/>
      2. Oh, this operation can error? Immediately think about either propagating or handling, and clean up<br/>
      3. Repeat Step 1 until function has completely written
      <br/><br/>
      Then when someone else comes along to read or review this function, they'll basically do the exact same steps to ensure the correctness of the function.
      <br/><br/>
      1. Read function starting from the top, making our way down<br/>
      2. Notice this call errors, reads the correctness of the propagation or handling code<br/>
      3. Repeat until we've read everything
      <br/><br/>
      People like that approach as we can see all the places a function can exit, how the control flows so to speak, however, the amount of exit points hardly matters, what matters is that did we exit the function because it succeeded? Or because it failed? And if we exited the function because we failed, the only thing we really care about is we cleaned up properly and propagated the error object. The mind set of writing with exceptions reflects this.
      <br/><br/>
      1. Write the function as if it doesn't error, aka the happy path<br/>
      2. Write clean up code<br/>
      3. Decide if we want to handle any errors, if yes, put a try/catch on the entire function<br/>
      4. Write clean up code for the error paths if there are any
      <br/><br/>
      Reading is of course done the same way
      <br/><br/>
      1. Read the happy path<br/>
      2. Ensure the clean up code is written corretly<br/>
      3. Read the error paths if the function actually handles any errors
      <br/><br/>
      But how do we write clean up code if we don't know which operations can error? That's just the wrong perspective regardless of your error handling scheme. Instead of focusing on which operations can error out, focus on what the state of your program should be regardless of how your function exits. For example:
      <br/><br/>
      - If we temporarily allocated heap memory, immediately write code that uses some construct that guarantees it to be de-allocated when we leave the scope.<br/>
      - If we change some member variable, but the change only makes sense if the function completes, immediately write code that uses some construct that could revert the state if we exited the function through a failure.
      <br/><br/>
      That is what you should be focusing on. Which brings us to...
    </p>
    <p><h2>The different ways we clean up</h2><br/>
      Knowing what clean up code to write has the same pains regardless of the error handling scheme you use. You need knowledge of what your operations are doing, and is the only time you need to know what your operations are actually doing, to know whether or not you need to call something else to properly clean up, or rely on documentation, otherwise you'll have a memory leak or have parts of your program in some unknown invalid state. 
      <br/><br/>
      The only thing that makes exceptions a bit harder is not being able to rely on all the same explicit clean up techniques value-based error handling uses. Here are some techniques that can be deployed which makes it much simpler for the user to write clean up code correctly and are also error handling scheme agnostic.
      <br/><br/>
      ### If you're calling a function, ideally it returns some type that knows how to clean up after itself<br/>
      ```c++<br/>
      void Func()<br/>
      {
      "{\n\
          std::unqiue_ptr<Foo> foo = SomeAllocatingFunction();\n\
          //Do operations\n\
      }"
      }
      ```<br/>
      Here `foo` cannot be forgotten to be deleted as `std::unique_ptr` will call delete in its destrutor. This is one of the least error prone techniques because the only thing the user has to do is to store the variable within the scope, which in most cases, is something a user will actually already do as they will probably be using it soon. No need for the user to remember to call some paired operation to properly clean up as it's already written in a class's destructor.
      <br/><br/>
      ### If your language supports composing functions, you could pass in a function to operate on some value, and the higher order function will be responsible for cleaning up<br/>
      ```c++<br/>
      void Func()<br/>
      {
      "{\n\
          database.Write(\"Key\", [](auto& value)\n\
          {\n\
              //modify value and do some operations\n\
          });\n\
      }"
      }
      ```<br/>
      In this example, `Write()` could maybe perform a rollback if the passed in function fails so we could modify the value without any worries of it becoming some invalid state. This is the least error prone way to do clean up assuming you're using a compatible error handling scheme with the higher order function expects you to use. For example, if `Write()` expects to use value-based errors, throwing an exception will completely break this safety. This is the only technique that's not error handling shceme agnostic
      <br/><br/>
      <h3>Commit on success</h3>
      ```c++<br/>
      void Foo::Func()<br/>
      {
      "{\n\
          auto temp = SomeValue();\n\
          //Do operations\n\
          member_variable = temp;\n\
      }"
      }
      ```
      <br/><br/>
      This technique is the simplest of them all, no need for fancy language features. If you make changes using a temporary variable, it doesn't matter how you change it, no visible state gets changed until you assign it back to the more permanent storage
      <br/><br/>
      <h3>If your language doesn't support something like destructors, but supports defer, write a defer statement after the operation you need cleaning up.</h3><br/>
      ```c++<br/>
      void Func()<br/>
      {
      "{\n\
          Foo* foo = SomeAllocatingFunction();\n\
          defer([foo]{ Free(foo); });\n\
          //Do operations\n\
      }"
      }
      ```<br/>
      Defer is an operation that runs when we exit the function, regardless of how we exit it. Some times however, you might not want that. Some times you only want the defer to execute on failure. In C++, these are commonly called scope guards. Defer is just one kind of scope guard. There's also a scope guard that can run only on failure, and one only on success. Defers can basically be seen as function specific destructors. It makes it less error prone for clean up with the downside that every function which operates on something that needs a paired function be called for clean up must be written in every function instead of doing it once by creating a class with a destructor. <br/>This is the only technique that would require the user to have knowledge of the paired operation, while all the other techniques are just completely hidden away from you making this technique less safe as you could forget about it, but at least you could only forget it once per function compared to forgetting at every potential exit point per function
      <br/><br/>
      These are just some of the ways we could write clean up code, mostly without the user requiring knowledge of how to properly clean up. Most of these techniques assume the abstraction has already been written. If you need to make those abstractions yourself and the clean up code has bugs, at least the bug is centralized.
    </p>
    <p><h2>Conclusion</h2><br/>
      So how do we reason about exceptions? It just really boils down into writing code with the intent of what we want it to do, and not the exact how, which is basically every abstraction ever. It is done by simplifying our functions. By caring only about when our function fails and not if any individual operations in our function can fail. By making sure the clean up code works regardless of how we exit the function. And lastly, just approaching the code with a different mind set where what the function achieves is more of the focus then the ways of exiting the function.
    </p>
    </>
  )
}

export default App
