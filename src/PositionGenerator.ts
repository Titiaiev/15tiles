import  { IPositionGenerator, IPoint } from './main';

class PositionGenerator implements IPositionGenerator {
  private max: number;
  private x: number;
  private y: number;

  constructor(max: number) {
    this.max = max;
    this.x = 0;
    this.y = 0;
  }

  next(): IPoint {
    const { x, y, max } = this;
    if (x < max) {
      this.x += 1;
    } else if (y < max) {
      this.y += 1;
      this.x = 0;
    } else {
      this.x = 0;
      this.y = 0;
    }

    return {
      x: x,
      y: y,
    };
  }
}

export default PositionGenerator;
