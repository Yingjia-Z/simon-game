import { SimonLogic } from "./simonlogic.ts";
import { 
  startSimpleKit, 
  setSKDrawCallback,
  setSKEventListener,
  SKEvent,
  SKResizeEvent,
  SKMouseEvent,
  SKKeyboardEvent,
  setSKAnimationCallback, 
  addSKEventTranslator } from "../../simplekit";
  import { CircularButton } from "./circleButton";


  const shapes: Drawable[] = [];

  const x = (window.innerWidth - 480)/ 5;
  const button1 = new CircularButton(x + 60, window.innerHeight / 2, "1", "hsl(0deg 50% 50%)");
  shapes.push(button1);

  const button2 = new CircularButton(x * 2 + 120 + 60, window.innerHeight / 2, "2", "hsl(90deg 50% 50%)");
  shapes.push(button2);

  const button3 = new CircularButton(x * 3 + 240 + 60, window.innerHeight / 2, "3", "hsl(180deg 50% 50%)");
  shapes.push(button3);

  const button4 = new CircularButton(x * 4 + 360 + 60, window.innerHeight / 2, "4", "hsl(270deg 50% 50%)");
  shapes.push(button4);



  const simonGame = new SimonLogic();

// draw shapes
setSKDrawCallback((gc) => {
  // clear background
  gc.clearRect(0, 0, window.innerWidth, window.innerHeight);

  ScoreMessage(gc);

  shapes.forEach((s) => {
    s.draw(gc);
  });
});

function ScoreMessage(gc: CanvasRenderingContext2D) {
  const x = window.innerWidth / 2;
  const y = window.innerHeight / 2 - 200;
  gc.font = "32pt sans-serif";

  gc.fillStyle = "black"; 
  gc.fillText("Score " + simonGame.score, x, y);
  gc.textAlign = "center";
  gc.textBaseline = "middle";
  gc.fillStyle = "black";
  gc.fillText("Press SPACE to play", x, y + 450);
}

startSimpleKit();
