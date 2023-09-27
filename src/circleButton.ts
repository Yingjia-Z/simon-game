import { Drawable } from "../../simplekit/drawable";

export class CircularButton implements Drawable {

    constructor(
        public x: number,
        public y: number,
        public text: string,
        public fill: string,
      ) {}

    isHighlighted = false;

//   get isFilled() {
//     return this.fill != "";
//   }


    draw(gc: CanvasRenderingContext2D) {
        gc.save();
        gc.fillStyle = this.fill;
        gc.beginPath();

        gc.arc(this.x, this.y, 120, 0, Math.PI * 2);
        gc.fill();

        // button label
        gc.font = "69pt sans-serif";
        gc.textAlign = "center";
        gc.textBaseline = "middle";
        gc.fillStyle = "white";
        gc.fillText(this.text, this.x, this.y);

        if (this.isFilled) gc.fill();

        gc.restore();
      }
}