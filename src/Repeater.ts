type Procedure = () => void;

export class Repeater {
  private timer: number | null;
  stop() {
    clearInterval(this.timer);
    this.timer = null;
  }
  start(cb: Procedure) {
    this.timer = setInterval(cb, 1000);
  }
}
