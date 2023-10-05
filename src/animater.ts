import { CallbackTimer } from "./timer";

// linear interpolation
export const lerp = (start: number, end: number, t: number) =>
  start + (end - start) * t;

//#region Easing Functions

export type EasingFunction = (t: number) => number;

export const flip: EasingFunction = (t) => 1 - t;

// changing the power adjusts the curve
export const easeOut: EasingFunction = (t) => Math.pow(t, 2);

export const easeIn: EasingFunction = (t) => flip(easeOut(flip(t)));

export const easeInOut: EasingFunction = (t) => lerp(easeOut(t), easeIn(t), t);

export const bow: EasingFunction = (a, x = 1) =>
  easeIn(Math.pow(a, 2) * ((x + 1) * a - x));

export const bounce: EasingFunction = (t, x = 1.5) =>
  Math.pow(2, 10 * (t - 1)) * Math.cos(((20 * Math.PI * x) / 3) * t);

export const sineEase: EasingFunction = (t) => Math.sin((t * Math.PI) / 2);

//#endregion

// basic animation object
export class Animater {
  constructor(
    public startValue: number,
    public endValue: number,
    public duration: number,
    public updateValue: (p: number) => void,
    public easing: EasingFunction = (t) => t,
    public loop: boolean = false // Add a loop parameter
  ) {
    this.originalStart = startValue;  // Store the original starting position
  }

  private startTime: number | undefined;


  start(time: number) {
    this.startTime = time;
    this._isRunning = true;
  }

  get isRunning() {
    return this._isRunning;
  }
  private _isRunning = false;

  update(time: number) {
    if (!this._isRunning || this.startTime === undefined) return;

    // proportion of time elapsed
    const t = (time - this.startTime) / this.duration;

    // calculate the new value
    const value = lerp(this.startValue, this.endValue, this.easing(t));

    // call the update callback
    this.updateValue(value);

    if (t >= 1) {
      this.startTime = undefined;
      this._isRunning = false;
      console.log("animation finished");
    }
    // if (t >= 1) {
    //   if (this.loop) {
    //     // Reverse the animation direction
    //     [this.startValue, this.endValue] = [this.endValue, this.startValue];
    //     this.startTime = time; // Reset the start time for the next loop iteration
    //   } else {
    //     this.startTime = undefined;
    //     this._isRunning = false;
    //     console.log("animation finished");
    //   }
    // }
  }

  returnToStart(time: number) {
    if (this._isRunning) {
      console.error("Animation is still running. Wait for it to complete before returning to start.");
      return;
    }

    // Swap the start and end values to move back to the original position
    [this.startValue, this.endValue] = [this.endValue, this.originalStart];
    this.start(time);
  }

}
