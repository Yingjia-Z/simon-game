import { Drawable } from "./simplekit/drawable";
import { distance } from "./simplekit/utility";
import { Animater } from "./animater.ts";
import { CallbackTimer } from "./timer";

const diameter = 120;

export class CircularButton implements Drawable {
  constructor(
    public x: number,
    public y: number,
    public d: number, // diameter
    public text: string,
    public fill: string,
    public stroke: string = "transparent"
  ) {}

  growAnimation: Animater | undefined;

  growTimer = new CallbackTimer(500, (t) => {
    this.d = diameter;
    // this.wait = !this.wait;
  });

  update(time: number) {
    this.growAnimation?.update(time);
    this.growTimer.update(time);
  }

  grow() {
    this.growAnimation = new Animater(this.d, diameter * 1.25, 500, (p) => {
      this.d = p;
    });
    // this.wait = !this.wait;
    this.growAnimation.start(performance.now());
    this.growTimer.start(performance.now());
  }

  draw(gc: CanvasRenderingContext2D) {
    gc.save();
    gc.fillStyle = this.fill;
    gc.strokeStyle = this.stroke;
    gc.lineWidth = 10;
    gc.beginPath();

    gc.arc(this.x, this.y, this.d / 2, 0, Math.PI * 2);
    gc.fill();
    gc.stroke();

    // button label
    gc.font = "39pt sans-serif";
    gc.textAlign = "center";
    gc.textBaseline = "middle";
    gc.fillStyle = "white";
    gc.fillText(this.text, this.x, this.y);

    gc.restore();
  }

  hitTest(mx: number, my: number) {
    let hit = false;
    const d = distance(mx, my, this.x, this.y);
    if (d < this.d / 2) {
      hit = true;
    }
    return hit;
  }
}
