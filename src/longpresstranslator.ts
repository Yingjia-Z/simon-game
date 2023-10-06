import { distance } from "./simplekit/utility";

// the simulated "raw" events from "window manager"
import { FundamentalEvent } from "./simplekit/create-loop";

// simulated UI Toolkit events
import {
  SKEvent,
  SKKeyboardEvent,
  SKMouseEvent,
  SKResizeEvent,
} from "./simplekit/events";

export const longpressTranslator = {
  state: "IDLE",
  // parameters for transitions
  movementThreshold: 50, // same as click
  timeThreshold: 1000, // milliseconds for holding down
  // for tracking thresholds
  startX: 0,
  startY: 0,
  startTime: 0,

  // returns a longpress event if found
  update(fe: FundamentalEvent): SKMouseEvent | undefined {
    switch (this.state) {
      case "IDLE":
        if (fe.type == "mousedown") {
          this.state = "DOWN";
          this.startX = fe.x || 0;
          this.startY = fe.y || 0;
          this.startTime = fe.timeStamp;
        }
        break;

      case "DOWN":
        // send 
        if (fe.type == "mouseup") {
          this.state = "IDLE";
        } else if (
          // mousemove > threshold
          fe.x &&
          fe.y &&
          distance(fe.x, fe.y, this.startX, this.startY) >
            this.movementThreshold
        ) {
          this.state = "IDLE";
          
        } else if (fe.timeStamp - this.startTime > this.timeThreshold) {
          this.state = "IDLE";
          return new SKMouseEvent("longpress", fe.timeStamp, fe.x || 0, fe.y || 0);
        }
        break;
    }
    return;
  },
};
