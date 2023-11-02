# Preface
When viewing various error handling schemes, I like to try to view them from just their positives. Getting caught up in their negatives typically causes people to for an alternative error handling scheme which causes people to try justify when one scheme should be used over the other despite all error handling schemes aim to achieve the same thing.

- Detecting an error
- Propogating the error
- Handling the error

While languages can implement the same error handling scheme, their implementations are not the same

I believe what makes a good error handling scheme from greatest to least importance is:

1. Distinct syntax (or lack of) to make it easier to see error handling is occuring
2. A compatible clean up routine
3. Tooling
4. Knowing if a function can error out and what errors they are

# Syntax
Show examples of various function structures in various languages...

_Insert code example here_

If you imagine actual code placed inside these functions, then you get a visually noisy function. All functions get pretty noisy. However it becomes a problem if you can't distinguish the noise created from error handling, and just normal code like the most primitive error handling scheme, return codes + if statements. The issue lies in that if statements now have multiple semantics attached to it.

- Is it detecting an error?
- Is it propgating the error?
- Is it handling the error?
- Is it jumping between happy paths?

I like exceptions in this case. We can clearly see if we're handling an error if we have a try / catch. However all languages that have exceptions that I know of does not have a dedicated way of converting exceptions, so catch actually have 2 semantics tied to it. Handling, or rethrowing. Potentially 3 actually, but that's for later.

I also like Rust's ? for propagating for similar reasons of unchecked exceptions' propogation, it makes propogation simple and adds basically no noise to the function and that's fine as propogating means that the function doesn't care about the error, and just pass it along. On the other hand, I probably won't like Rust's pattern matching for handling errors as I'd assume that pattern matching will be used more frequently for things other than error handling. I don't use Rust, so I can only assume from things that I've heard. This would make error handling through pattern matching have similar issues to if statements for error handling.

# Compatible Clean Up Routine
An error handling scheme is nothing without a good compatible clean up routine. Take Java and C#'s exception implementation for example. For quite a few years in their respective languages they didn't have try with resources / using in their respective languagues. I couldn't find anything about finally, but imagine an exception implementation with only try / catch? You'd have to fill every intermediate function between the thrower and the catch that would clean up with try / catch so that they can properly clean up. Now you overload the semantics of catch statements to be either, rethrowing, handling, or clean up. Not to mention, if there are specific exceptions that you do want to handle specfically, you'd have to copy-paste the clean up code between them. That's a nightmare. Finally statement is a step in the right direction as you'd only have to place the clean up code in one place, however, now you have to write code detecting how far along the try block you are if there are multiple things to clean up, usually in a LIFO order. That's still a lot of ways to do things wrong.

C++'s destructors, I think, are the bare minimum best way to clean up code. They're called no matter how you exit the function*, and only when an object's lifetime begins, which means for exceptions, you no longer have to track how far into a try block code has been executed to figure out what needs to clean up. The ability to have code execute regardless of how a function exits is such a powerful tool because it also works well with basic return codes + if statements, and the likes of Result / expected kinds of error handling, which is why I think this is the bare minimum thing a language should have. Java and C# added a way to do it with try with resources and using, which in C# requires inheriting a interface for it to work. It's a work around but still acceptable.

*in C++, this only applies to objects living on the stack

I said that C++'s destructors are the bare minimum best way to clean up code, but what could be better?. I can only think for exceptions, in which case we should have "defers", which are great for one time clean up routines. Any language with destructor like functionality and storing lambdas would be able to simulate "defers". The next step above that are having scope guards like "scope exit" and "scope success", which executes their clean up routine only if an exception is in flight, or not in flight respectively. Having them in the tool box allows you to write code like this.

_Insert code example here_

And then one step farther, building on those abstractions to write code like this.

_Insert code example here_
