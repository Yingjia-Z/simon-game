import { SimonLogic } from "./simonlogic.ts";
import { CircularButton } from "./circleButton";
import { CallbackTimer } from "./timer.ts";
import { Animater, sineEase } from "./animater.ts";
import { longpressTranslator } from "./longpresstranslator.ts";

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
} from "./simplekit";

const shapes: Drawable[] = [];

let width = 0;
let height = 0;

let msg = "";

const m = { x: 0, y: 0 };

let buttonCount = 0;

const diameter = 120;

let isCheating = false;

// let currentIndex = 0;
// let buttonIdx = 0;

let isPaused = false;

// maximum hue degree / maximum number of buttons
const hueDegree = 36;

let defaultButtonNum = 4;

initizeButton();

// create simon game
let simonGame = new SimonLogic(buttonCount);

// handle event
setSKEventListener((e, gc) => {
  switch (e.type) {
    case "mousemove":
      const me = e as SKMouseEvent;
      m.x = me.x;
      m.y = me.y;

      // thick highlight effect
      shapes.forEach((s) => {
        if (simonGame.state == "HUMAN") {
          if (s instanceof CircularButton) {
            if (s.hitTest(me.x, me.y)) {
              s.stroke = "yellow";
              console.log(`button: ${s.text}`);
            } else {
              s.stroke = "transparent";
            }
          }
        } else {
          s.stroke = "transparent";
        }
      });
      break;

    case "resize":
      const re = e as SKResizeEvent;
      width = re.width;
      height = re.height;
      changeAlignment();
      break;

    case "click":
      const mc = e as SKEvent;
      m.x = mc.x;
      m.y = mc.y;
      shapes.forEach((s) => {
        if (simonGame.state == "HUMAN") {
          if (s instanceof CircularButton) {
            if (s.hitTest(mc.x, mc.y)) {
              s.grow();
              simonGame.verifyButton(s.text - 1);
            }
          }
        }
      });
      break;

    case "longpress":
      if (simonGame.state == "HUMAN") {
        if (simonGame.remainingSequence().length === 0) {
          console.warn("no more button to show.");
          break;
        }
        let next = simonGame.remainingSequence()[0];
        shapes[next].grow();
      }
      break;

    case "keypress":
      const { key } = e as SKKeyboardEvent;
      console.log(`${e.type} '${key}' at ${e.timeStamp} `);

      switch (key) {
        // cancels the current game, restarts a new one
        case "q":
          simonGame = new SimonLogic(buttonCount);
          break;

        case "?":
          isCheating = !isCheating;
          console.log(isCheating);
          break;

        case " ":
          shapes.forEach((s) => {
            s.putbackAttract();
          });
          if (simonGame.state == "COMPUTER" || simonGame.state == "HUMAN") {
            console.warn("Please finish current round");
          } else {
            simonGame.newRound();
            // currentIndex = 0;
            playNextButton();
          }
          break;

        case "+":
          if (
            simonGame.state == "START" ||
            simonGame.state == "WIN" ||
            simonGame.state == "LOSE"
          ) {
            if (buttonCount == 10) {
              console.warn("Button number can't exceed 10");
              break;
            }
            addButton();
            changeAlignment();
            // return to start message and rest the game
            simonGame = new SimonLogic(buttonCount);
          } else {
            console.warn("Can't add button in this state");
            break;
          }
          break;

        case "-":
          if (
            simonGame.state == "START" ||
            simonGame.state == "WIN" ||
            simonGame.state == "LOSE"
          ) {
            if (buttonCount == 1) {
              console.warn("Button number can't be less than 1");
              break;
            }
            buttonCount -= 1;
            shapes.pop();
            changeAlignment();
            simonGame = new SimonLogic(buttonCount);
          } else {
            console.warn("Can't remove button in this state");
            break;
          }
          break;
      }
      break;
  }
});

// draw shapes
setSKDrawCallback((gc) => {
  // clear background
  gc.clearRect(0, 0, width, height);

  scoreMessage(gc);

  shapes.forEach((s) => {
    s.draw(gc);
  });
});

// display score and message
function scoreMessage(gc: CanvasRenderingContext2D) {
  gc.save();

  // show the score
  gc.font = "32pt sans-serif";
  gc.fillStyle = "black";
  gc.fillText(
    "Score " + simonGame.score,
    window.innerWidth / 2.3,
    window.innerHeight / 3.6
  );
  gc.textAlign = "center";
  gc.textBaseline = "middle";

  // turn on cheating mode
  if (isCheating) {
    gc.fillStyle = "grey";
    gc.fillText("CHEATING", window.innerWidth / 1.2, window.innerHeight / 1.1);
    gc.fillStyle = "black";
  }

  // change message displayed according to game state
  if (simonGame.state == "START") {
    msg = "Press SPACE to play";
  } 
  // else if (simonGame.state == "COMPUTER") {
  //   changeAlignment();
  //   msg = "Watch what I do …";
  // } 
  // else if (simonGame.state == "HUMAN") {
  //   if (!isCheating) {
  //     msg = "Now it’s your turn";
  //   } else {
  //     let arr = simonGame.remainingSequence();
  //     msg = arr.map((x) => x + 1);
  //   }
  //   //   if (isCheating) {
  //   //     let arr = simonGame.remainingSequence();
  //   //     msg = arr.map((x) => x + 1);
  //   // }
  // } 
  else if (simonGame.state == "WIN") {
    msg = "You won! Press SPACE to continue";
    shapes.forEach((s) => {
      s.stroke = "transparent";
    });
  } else if (simonGame.state == "LOSE") {
    msg = "You lose. Press SPACE to play again";
    shapes.forEach((s) => {
      s.loseAttract();
    });
  }
  gc.fillText(msg, window.innerWidth / 2, window.innerHeight / 1.3);
  gc.restore();
}

// change button alignment when button added or removed
// change button location when window is resized
function changeAlignment() {
  const gap = (window.innerWidth - diameter * buttonCount) / (buttonCount + 1);
  for (let i = 0; i < buttonCount; i++) {
    shapes[i].x = gap * (i + 1) + i * diameter + diameter / 2;
    shapes[i].y = window.innerHeight / 2;
  }
}

// add button
function addButton() {
  buttonCount += 1;

  shapes.push(
    new CircularButton(
      0,
      window.innerHeight / 2,
      diameter,
      buttonCount,
      // add 108 degree to separate colors of buttons more clearly
      `hsl(${hueDegree * buttonCount + 108}deg 50% 50%)`
    )
  );
}

// initize button number to 4
function initizeButton() {
  while (defaultButtonNum > 0) {
    addButton();
    changeAlignment();
    defaultButtonNum -= 1;
  }
}

// add animations
setSKAnimationCallback((time) => {
  shapes.forEach((s) => {
    s.update(time);
    if (simonGame.state == "START" || simonGame.state == "WIN") {
      bounce(s);
    }
  });
  simonWaitTimer.update(time);
});

// introduce time gap between animations
const simonWaitTimer = new CallbackTimer(1000, playNextButton);

// function playNextButton() {
//   if (simonGame.index >= currentIndex) {
//     currentIndex += 1;
//     buttonIdx = simonGame.nextButton();
//     shapes[buttonIdx].grow();
//     simonWaitTimer.start(performance.now());
//   }
// }

function playNextButton() {
  if (simonGame.state == "COMPUTER") {
    // currentIndex += 1;
    let buttonIdx = simonGame.nextButton();
    shapes[buttonIdx].grow();
    simonWaitTimer.start(performance.now());
    msg = "Watch what I do …";
  } 
  else if (simonGame.state == "HUMAN") {
    if (!isCheating) {
      msg = "Now it’s your turn";
    } 
    else {
      let arr = simonGame.remainingSequence();
      msg = arr.map((x) => x + 1);
    }
  }
}

let dy = 1;
const maxY = window.innerHeight / 1.8;
const minY = window.innerHeight / 2.8;

function bounce(button, time: number) {
  // if object hits the limits, change direction
  if (button.y < minY || button.y > maxY) {
    dy *= -1.0;
  }
  button.y += dy;
}

addSKEventTranslator(longpressTranslator);

startSimpleKit();
