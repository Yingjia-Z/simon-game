import { Drawable } from "../../simplekit/drawable";
import { distance } from "../../simplekit/utility";

const diameter = 120;

export class CircularButton implements Drawable {
  constructor(
    public x: number,
    public y: number,
    public text: string,
    public fill: string,
    public stroke: string = "transparent"
  ) {}

  draw(gc: CanvasRenderingContext2D) {
    gc.save();
    gc.fillStyle = this.fill;
    gc.strokeStyle = this.stroke;
    gc.lineWidth = 10;
    gc.beginPath();

    gc.arc(this.x, this.y, diameter / 2, 0, Math.PI * 2);
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
    if (d < diameter / 2) {
      hit = true;
    }
    return hit;
  }
}
