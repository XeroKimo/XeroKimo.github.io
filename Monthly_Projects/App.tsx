import ShadowRenderingVideo from './Assets/2024-11-24 17-22-57.mp4'
import Win32Calculator from './Assets/Win32_Calculator.png'
import WinUI3Calculator from './Assets/WinUI3_Calculator.png'
import AndroidCalculator from './Assets/Android_Calculator.png'
import './App.css'
import { JSX } from 'react'
import Page from '@common/Page_Templates/Page'

function YearBound(prop: { children?: JSX.Element[] | JSX.Element, year: string }): JSX.Element {
  return (
    <>
      <h1>{prop.year}</h1>
      {prop.children}
    </>
  )
}

function Entry(prop: { children?: JSX.Element[] | JSX.Element, month: string, title: string }): JSX.Element {
  return (
    <>
      <h2>{prop.month} - {prop.title}</h2>
      {prop.children}
    </>
  )
}

function App(): JSX.Element {

  return (
    <>
      <Page>
        <YearBound year="2025">
          <Entry month="March" title="Build Systems">
            <p>
              When coding C++, I've always stuck to MSBuild because it's just configured for you when you're coding in Visual Studio. 
              Last month, I decided to try to step away from my comfort zone and finally learn the defacto standard build system. CMake.
              <br/><br/>
              Now, I didn't really want to learn it, but I believe it to be useful to learn as it helps allow cross-platform development, 
              though I'm not at a point where I've ever thought of doing cross-platform development, however, a use case I need it for is creating a 
              new package for the package manager vcpkg. I once attempted to make one along with a custom registry (a repository which lists where to find packages), 
              and I couldn't get it to work purely from its tutorial. I expect to run into this sort of scenario more and more as I go on my developer journey, 
              so it can't hurt to learn it.
              <br/><br/>
              CMake is old, it has been updated a lot over decades which means there's going to be a lot of information and tutorials out there... 
              but it also means a lot are likely to be outdated, so I sought to the C++ community for help 
              and a few recommended the book "Professional CMake". It's only available as an E-Book, 
              but according to the site, once purchased, you get all future editions for free, so I see it as pretty good value if you'd like to stay up to date.
              <br/><br/>
              The book covers a lot, which the table of contents show, being visible before purchase. I have only manage to read 1/3rd of the 
              book before the end of the month, but I've learnt quite a bit, something I won't appreciate until I run into the use cases requiring 
              the knowledge though, kind of like the plethora of features C++ offers which I have learned to appreciate. Each chapter shows the most modern 
              way to achieve something along with showing off the old ways and why it was changed and common use cases. They also show off dangerous features and best 
              practices to mitigate the dangers. I've even managed to recognize a few basic concepts in the book as I've ran into similar concepts while having to 
              configure MSBuild in GUI mode such as linking libraries, setting compiler flags, among a few.
              <br/><br/>
              For information about CMake, I highly recommend "Professional CMake", but if you're looking for a tutorial, I'm not quite sure I can recommend it, 
              the first 5 chapters is a basic getting started tutorial and is available for free, but everything else I've read so far has been information and best 
              practices, which I believe to be enough to learn by practice.
            </p>
          </Entry>
          <Entry month="February" title="Building A Calculator and Exploring UI Frameworks">
            <p>
              I wanted to try something outside game dev, or close enough in the field of game dev, and what came to mind was making a calculator... 
              and honestly, making one, all be it bad, was simpler than I thought. From there, I had 3 choices in front of me<br/><br/>

              - Make a good calculator<br/>
              - Go lower level in parsing and learn how things like converting a string to integer work<br/>
              - Try to make a bunch of GUIs for the calculator<br/><br/>

              I chose to make a bunch of GUIs since I think I'd learn more new things from doing so. 
              The goal was 2 things:<br/><br/>
              
              1. Expose buttons which actually controlled the calculator <br/>
              2. Make sure the buttons filled the screen. <br/><br/>
              
              Actually styling the app was non goal. Here were the results.<br/><br/>

              Using old window's APIs, Win32, there isn't really any format to control the size and position of the UI, so I manually coded it in C++.<br/><br/>
              
              <img src= {Win32Calculator} width="25%" height="25%" /><br/><br/>

              Next, I tried WinUI3. It uses XAML in order to layout it's elements, and you could choose to do C++ or C# for the backend. 
              I choose C++ so I could directly reuse any of the C++ code. As for trying to do the layout, 
              WinUI3's XAML doesn't seem to have a way to support stretching the elements so that it'd fill the window without grabbing
              3rd party layouts, or just manually making it yourself. I spent too much time trying without 3rd party layouts so I just decided to move on.<br/><br/>

              <img src= {WinUI3Calculator} width="80%" height="80%" /><br/><br/>

              Last, I did Android. I had to move to Kotlin in order to do this as I was initially following the official Android tutorial 
              to navigate my way around. I've never used Kotlin before, so I was learning 2 things at once. I could've used C++ like I 
              did with the previous 2, and there were C++ project presets, but those presets out of the box doesn't even have the 
              environment completely set up. A quick search, and there's extra steps to get a C++ project working that's not covered 
              in any official docs, so I just went with the native language, Kotlin. <br/><br/>
              
              I re-implemented my calculator in Kotlin, and used Jetpack Compose for the UI. Just like WinUI3, I couldn't figure out 
              how to make the layout work the way I envisioned with what's offered out of the box, which meant trying to do it manually again, 
              which as can be seen, I decided not to do as I was going to move on...<br/><br/>

              <img src= {AndroidCalculator} width="40%" height="40%" /><br/><br/>

              I was going to try React as my final UI, having to learn both JavaScript and React, but I was burnt out by the time I got to 
              the end of my Android journey, so I decided to stop there.<br/><br/>

              My conclusion to all this, both WinUI3, and Jetpack Compose probably does have some built in way to actually mimic what I've 
              manually done in Win32... I just can't seem to like frontend work as I find that you need some magic incantation 
              for something to layout the way you expect it to be, like something might work when it's the root element, but 
              the moment you put said element in a container, it doesn't work, and maybe if you have some specific mix of 
              containers, it suddenly does work.... I just don't see how the logic works.<br/><br/>

              Bonus: I ran into a reddit thread in the midst of making the calculator which links 
              a post about the journey of making a good calculator. It's an interesting read.<br/>
              <a href="https://www.reddit.com/r/programming/comments/1iqz489/a_calculator_app_anyone_could_make_that/">https://www.reddit.com/r/programming/comments/1iqz489/a_calculator_app_anyone_could_make_that/</a>
            </p>
          </Entry>

          <Entry month="January" title="On Hiatus" />
        </YearBound>
        <YearBound year="2024">
          <Entry month="December" title="Intermediate Rendering">
            <p>
              This month, I tackled the topic of Physics and Physics Engines. Always wanted to know how it worked. I could just look at some
              open source engines and look at there code, but what's the fun in that, so of course I'm going to code my own?...
              Well I didn't end up getting any coding done since unlike rendering,  I'm pretty rusty in physics, and had no clear goals or
              much a clue for what goes into a physics engine, so I didn't know where to start.
            </p>
            <p>
              I ended picking up the book "Game Physics" by Ian Millington which goes over exactly what I was lacking
              and a nice refresher on various physics and some math topics. I already knew some high level basics, since it's something you run into
              when using physics engines in the first place, like collision detection, and forces. But the actual details on how these are implemented
              and all interact with each other... I just don't know where to start.
            </p>
            <p>
              One thing I did attempt to do for fun was trying to make strong types for units and try to use that for the engine.
              In C++ there are a few units libraries out there already, a prominent upcoming one is the mp-units library,
              however it didn't support operations for multiplying and dividing different units to go from say "m" -{`>`} "m/s",
              though later on, I discovered it actually does, but I guess I was doing something it didn't like as the equations
              I wrote was giving me compiler errors.<br /><br />
              In order to properly calculate the correct unit type for a given equation I turned to metaprogramming, and boy is it a daunting task.
              It requires a lot of variadic template manipulation that I couldn't figure out so I just did the next best thing, copy
              pasting the exact resulting units when multiplying / dividing, but there were a lot of cases to consider.
            </p>

          </Entry>


          <Entry month="November" title="Intermediate Rendering">
            <p>
              During my studies, we learnt some basic rendering with OpenGL. Going up to drawing some primitives, texturing, and some basic effects.
              I wanted to learn more, so the first topic of my monthly learning was to go beyond the basics. I booted up Learn OpenGL in order to read up on
              those topics and implement them myself, but with a twist, I'm going to implement them in DX11 as I ended up liking it's API more than OpenGL when I was learning on my own.

              <br /><br />I got as far as to doing basic shadow maps, and surprisingly, the technique is so simple and pretty genius. This is also when I started to understand making render passes.
            </p>
            <video width="320" height="240" muted controls><source src={ShadowRenderingVideo} type="video/mp4" /></video>
            <p>
              Even though I've only gotten to basic shadow mapping, this gave me new found awe on modern renderers as not only is the code to support
              basic shadow mapping is starting to get decently complicated, my code isn't even structured at all yet. Just imagining what a renderer
              in a AAA engine needs in order to support all their techniques while also being strucutured, I can only begin to imagine how crazy complicated
              these renderers are.
            </p>
          </Entry>
        </YearBound>
      </Page>
    </>
  )
}

export default App
