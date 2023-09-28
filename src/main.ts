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
  addSKEventTranslator,
} from "../../simplekit";
import { CircularButton } from "./circleButton";

let simonGame = new SimonLogic();

const shapes: Drawable[] = [];

let width = 0;
let height = 0;

const m = { x: 0, y: 0 };

let buttonCount = 0;


// TODO: change the title in index.html?
const x = (window.innerWidth - 480) / 5;
// TODO: how to change the alignmnet?
// TODO: piazza @66
buttonCount++;
const button1 = new CircularButton(
  x + 60,
  window.innerHeight / 2,
  buttonCount,
  "hsl(0deg 50% 50%)"
);
shapes.push(button1);

const button2 = new CircularButton(
  x * 2 + 120 + 60,
  window.innerHeight / 2,
  "2",
  "hsl(90deg 50% 50%)"
);
shapes.push(button2);
buttonCount++;

const button3 = new CircularButton(
  x * 3 + 240 + 60,
  window.innerHeight / 2,
  "3",
  "hsl(180deg 50% 50%)"
);
shapes.push(button3);
buttonCount++;

const button4 = new CircularButton(
  x * 4 + 360 + 60,
  window.innerHeight / 2,
  "4",
  "hsl(270deg 50% 50%)"
);
shapes.push(button4);
buttonCount++;

// handle event
setSKEventListener((e, gc) => {
  switch (e.type) {
    case "mousemove":
      const me = e as SKMouseEvent;
      m.x = me.x;
      m.y = me.y;
      shapes.forEach((s) => {
        if (simonGame.state == "HUMAN") {
          if (s instanceof CircularButton) {
            //TODO: does this work? after resize, the stroke will show
            if (s.hitTest(me.x, me.y)) {
              s.stroke = "yellow";
              console.log(s.text);
            } else {
              s.stroke = "whitesmoke";
            }
          }
        } else {
          s.stroke = "whitesmoke";
        }
      });
      break;

    case "resize":
      const re = e as SKResizeEvent;
      width = re.width;
      height = re.height;
      break;

    case "click":
      const mc = e as SKEvent;
      m.x = mc.x;
      m.y = mc.y;
      shapes.forEach((s) => {
        if (simonGame.state == "HUMAN") {
          if (s instanceof CircularButton) {
            if (s.hitTest(mc.x, mc.y)) {
              simonGame.verifyButton(s.text)
            }
          }
        }
      });
      break;

    case "keypress":
      const { key } = e as SKKeyboardEvent;
      console.log(`${e.type} '${key}' at ${e.timeStamp} `);

      switch (key) {
        // cancels the current game, restarts a new one
        case "q":
          simonGame = new SimonLogic();
          break;

        case " ":
          // TODO: what does this mean: from nextbutton(): next button: index 0, button 0
          // console.log("hi");
          simonGame.newRound();
          simonGame.nextButton();
          // TODO: stuck after round 1 won
          break;

        case "+":
          buttonCount += 1;
          // TODO: hues forming a pattern of distinct? can i use random number?
          // TODO: if the buttoncount is more than 10 or less than 1, will there be any error message displayed?
          // TODO: which data structure to use to format the buttons? after pushed into shapes and able to change properties
          // TODO: after adding a button, how to tell simonlogic?
          shapes.push(
            new CircularButton(
              x * 4 + 360 + 60,
              window.innerHeight - 100,
              buttonCount,
              "hsl(270deg 50% 50%)"
            )
          );
          break;

        case "-":
          shapes.pop();
          break;
      }
      break;
  }
});

// draw shapes
setSKDrawCallback((gc) => {
  // clear background
  gc.clearRect(0, 0, width, height);

  ScoreMessage(gc);

  shapes.forEach((s) => {
    s.draw(gc);
  });
});

function ScoreMessage(gc: CanvasRenderingContext2D) {
  const x = window.innerWidth / 2;
  const y = window.innerHeight / 2 - 200;
  gc.save();
  gc.font = "32pt sans-serif";

  gc.fillStyle = "black";
  gc.fillText("Score " + simonGame.score, x, y);
  gc.textAlign = "center";
  gc.textBaseline = "middle";
  gc.fillStyle = "black";

  // change message displayed according to game state
  let msg = "";
  if (simonGame.state == "START") {
    msg = "Press SPACE to play";
  } else if (simonGame.state == "COMPUTER") {
    msg = "Watch what I do …";
  } else if (simonGame.state == "HUMAN") {
    msg = "Now it’s your turn";
  } else if (simonGame.state == "WIN") {
    msg = "You won! Press SPACE to continue";
  } else if (simonGame.state == "LOSE") {
    msg = "You lose. Press SPACE to play again";
  }
  gc.fillText(msg, x, y + 450);
  gc.restore();
}

startSimpleKit();
