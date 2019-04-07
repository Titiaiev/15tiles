class Info {
  constructor() {
    this._timeStart = null;
    this._steps = 0;
  }

  get data() {
    const { time: recordedTime, steps: recordedSteps } = this.getRecord();
    return {
      time: this.time,
      steps: this.steps,
      recordedTime,
      recordedSteps,
    };
  }

  get time() {
    let delta = 0;
    let timer = 0;
    if (this._timeStart) {
      delta = (Date.now() - this._timeStart);
      timer = Math.floor(delta / 1000);
    }
    return timer;
  }

  get steps() {
    return this._steps;
  }

  incrementSteps = () => {
    this._steps += 1;
  }

  startTimer = () => {
    if (!this._timeStart) this._timeStart = Date.now();
  }

  resetTimer = () => {
    this._steps = 0;
  }

  updateRecord = () => {
    try { // Edge бросает ошибку если открыть игру по протоколу file:// (запустить игру из проводника)
      const recorded = JSON.parse(localStorage.getItem('game-best-result'));
      const now = {
        time: this.time,
        steps: this.steps,
      };

      if (recorded) {
        now.time = (Number(now.time) < Number(recorded.time)) ? now.time : recorded.time;
        now.steps = (Number(now.steps) < Number(recorded.steps)) ? now.steps : recorded.steps;
      }
      console.log(now);
      localStorage.setItem('game-best-result', JSON.stringify(now));
    } catch (err) {
      console.log(err);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getRecord = () => {
    let record = { time: 0, steps: 0 };

    // Edge бросает ошибку если открыть игру по протоколу file:// (запустить игру из проводника)
    // https://stackoverflow.com/questions/32374875/localstorage-not-working-in-edge
    try {
      if (!window.localStorage) return;
      const recorded = localStorage.getItem('game-best-result');

      if (recorded) {
        record = JSON.parse(recorded);
      }
    } catch (err) {
      console.log(err);
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      return record;
    }
  }
}


export default Info;
