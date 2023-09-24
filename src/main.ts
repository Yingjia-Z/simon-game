import { SimonLogic } from "./simonlogic.ts";

function  draw() {
  // add canvas element to DOM
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);

  // set a background style to make it easier to see the canvas
  canvas.style.setProperty("background", "white");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // get graphics context
  const gc = canvas.getContext("2d");
  if (!gc) return;

  // show score and message
  ScoreMessage(gc);


  // set circular button
  CircularButtion(gc);
  

}

draw();

function ScoreMessage(gc: CanvasRenderingContext2D) {
  const x = window.innerWidth / 2;
  const y = window.innerHeight / 2 - 200;
  gc.font = "32pt sans-serif";

  const simonGame = new SimonLogic();
  gc.fillStyle = "black"; 
  gc.fillText("Score " + simonGame.score, x - 100, y);
  gc.textAlign = "center";
  gc.textBaseline = "middle";
  gc.fillStyle = "black";
  gc.fillText("Press SPACE to play", x, y + 450);
}


function CircularButtion(gc: CanvasRenderingContext2D) {
  const circleDiameter = 120;
  
  // local function to draw a circle
  const circle = (x: number, y: number, number: string) => {
    gc.beginPath();
    gc.arc(x, y, circleDiameter, 0, Math.PI * 2);
    gc.fill();
    gc.font = "79pt sans-serif";
    gc.fillStyle = "black";
    gc.textAlign = "center";
    gc.textBaseline = "middle";
    gc.fillStyle = "white";
    gc.fillText(number, x, y);
    };
  
    const x = (window.innerWidth - 480)/ 5;
    gc.fillStyle = "hsl(0deg 50% 50%)";
    circle(x, 450, "1");
  
    gc.fillStyle = "hsl(90deg 50% 50%)";
    circle(x * 2 + circleDiameter, 450, "2");
  
    gc.fillStyle = "hsl(180deg 50% 50%)";
    circle(x * 3 + circleDiameter * 2, 450, "3");
  
    gc.fillStyle = "hsl(270deg 50% 50%)";
    circle(x * 4 + circleDiameter * 3, 450, "4");
}




// import './style.css'
// import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.ts'

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
