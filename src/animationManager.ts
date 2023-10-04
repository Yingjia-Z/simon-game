import { Animater } from "./animater";

export * from "./animater";

class AnimationManager {
  protected animations: Animater[] = [];

  add(animation: Animater) {
    this.animations.push(animation);
    animation.start(performance.now());
  }

  update(time: number) {
    if (this.animations.length === 0) return;
    console.log(`updating ${this.animations.length} animations`);
    // update every animation currently running
    this.animations.forEach((a) => a.update(time));

    // remove any animations that finished
    this.animations = this.animations.filter((a) => a.isRunning);
  }
}

// create the singleton
export const animationManager = new AnimationManager();
