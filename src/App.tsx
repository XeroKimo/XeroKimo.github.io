
import PortraitImg from './Portfolio/Portrait.jpg'
import OnMyWayHomeGif from './Portfolio/OnMyWayHome.gif'
import MechroneerGif from './Portfolio/Mechroneer.gif'
import WordMeetsTeeGif from './Portfolio/WordMeetsTee.gif'
import ChessSoccerGif from './Portfolio/ChessSoccer.gif'
import './App.css'
import {  JSX  } from 'react'

type ColumnElement = 
{
  children : JSX.Element;
  imageSrc : string;
}

//Put image on the left, some description on the right
function LeftColumn(props: ColumnElement) : JSX.Element
{
  return (
    <div className="flex-container">
    <div className="columnImage">
      <div>
        <img src= {props.imageSrc} width="100%" height="100%" />
      </div>
    </div>
    <div className="columnText">
      {props.children}

    </div>
  </div>)
}

//Put image on the right, some description on the left
function RightColumn(props: ColumnElement) : JSX.Element
{
  return (
    <div className="flex-container">
    <div className="columnText">
      {props.children}
    </div>
    <div className="columnImage">
      <div>
        <img src= {props.imageSrc} width="100%" height="100%" />
      </div>
    </div>
  </div>)
}

function Profile() : ColumnElement
{
  const description = () : JSX.Element => (<><h1>About Me</h1>
    <p>
      Jean Lorenz Alarcon, preferred to be called Renzy. Professional game
      developer since 2020. Excelling in various fields such as UI, gameplay
      systems, networking, and tooling programming with experience in major
      game engines such as Unreal, Unity, and Godot. On my off time I like to
      play video games, or try programming things outside my expertise like
      application development and graphics programming. I'm open to any game
      developer positions, but also open to broaden my horizons to positions
      like web dev, embedded, or as an application dev.
    </p>
    <h2>Tech Stack</h2>
    <p>
      Engines: Unreal, Unity, Godot, <br />
      Languages: C++, C#, Java, Unreal Blueprint <br />
      APIs: DX11, OpenGL, Firebase, PUN2, Unreal Networking Solution, SDL2,
      Dear ImGUI, Box2D, Win32 <br />
      Source Control: Github, SVN, Perforce <br />
    </p>
    <p>
      <a href="https://github.com/XeroKimo">Github</a>
    </p></>);
  
  return { imageSrc: PortraitImg, children: description() }
}

function OnMyWayHome() : ColumnElement
{
  const description = () : JSX.Element => (<><h1>On My Way Home</h1>
    <p>
      On My Way Home is an endless runner game submitted for Brackey's Game
      Jam 2024. Avoid obstacles by either switching lanes or jumping over and
      sliding under them
    </p>
    <p>
      It was made using Godot and was my biggest Godot project at the time.
    </p>
    <p>
      Download and play now at{" "}
      <a href="https://xerokimo.itch.io/on-my-way-home">Itch.io</a>
    </p></>
    
  );
  
  return { imageSrc: OnMyWayHomeGif, children: description() }
}

function Mechroneer() : ColumnElement
{
  const description = () : JSX.Element => (<>
    <h1>Mechroneer</h1>
    <p>
      Mechroneer was the first game I developed. It was my student capstone
      project. Mechroneer is a MOBA similar to Battlerite, but with
      customizable robots. Build your own robot by mixing and matching various
      parts. Those parts will determine the stats and abilities available to
      your robot. Toss your robot into the arena to fight against other
      players or AI.
    </p>
    <p>
      The game was made with Unity and I oversaw various aspects of the game
      such as the ability system, the UI stack, networking, and the overall
      architecture of the game.
    </p>
    <p>
      Download now at <a href="https://acsl.itch.io/mechroneer">Itch.io</a>
    </p>
    </>
  );
  
  return { imageSrc: MechroneerGif, children: description() }
}

function WordMeetsTee() : ColumnElement
{
  const description = () : JSX.Element => (<>
    <h2>WordMeetsTee</h2>
    <p>
      WordMeetsTee is a mobile game where scrabble meets golfing. Each turn
      you pick a club and gain letters to build as many words as possible to
      try and reach the hole. Play solo or against other players either in
      real time or freely quit and come back later when your opponent has
      finally made a move.
    </p>
    <p>
      WordMeetsTee was made in Unity and I was in charge of networking,
      microtransactions, cloud saving, UI, and various gameplay systems.
    </p>
    <p>
      Play now on{" "}
      <a href="https://play.google.com/store/apps/details?id=com.akatuapa.wordmeetstee">
        Android
      </a>{" "}
      or{" "}
      <a href="https://apps.apple.com/ca/app/wordmeetstee/id1576885901">
        iOS
      </a>
    </p>
    </>
    
  );
  
  return { imageSrc: WordMeetsTeeGif, children: description() }
}

function ChessSoccer() : ColumnElement
{
  const description = () : JSX.Element => (<>
    <h2>Chess Soccer</h2>
    <p>
      Chess Soccer was developped for a game jam back in 2020. The name of the
      game is quite literal; using chess pieces to play soccer. Capture pieces
      to give them a temporary time out. Grab the ball, pass it around, and
      try to score into the goal! First to 3 points wins!.
    </p>
    <p>
      This game was developped in a pair. I did all the programming while my
      partner did the art and sound effects
    </p>
    <p>
      Download now at{" "}
      <a href="https://xerokimo.itch.io/chess-soccer">Itch.io</a>
    </p></>
    
  );
  
  return { imageSrc: ChessSoccerGif, children: description() }
}

function App() : JSX.Element {

  return (
    <>
      {LeftColumn(Profile())}
      <h1>Projects</h1>
        {RightColumn(OnMyWayHome())}
        {LeftColumn(Mechroneer())}
        {RightColumn(WordMeetsTee())}
        {LeftColumn(ChessSoccer())}
    </>
  )
}

export default App
