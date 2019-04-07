class Info {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.keysBlocked = false;
    this.timerState = false;
  }

  openInfo = () => {
    this.view.show(this.model.data, this.timerState);
    // console.log(this.model.data);
    this.keysBlocked = !this.keysBlocked;
  }

  closeInfo = () => {
    this.view.hide();
    this.keysBlocked = !this.keysBlocked;
  }

  startTimer = () => {
    this.model.startTimer();
    this.timerState = true;
  }

  resetTimer = () => {
    this.model.resetTimer();
    this.timerState = false;
  }

  incrementSteps = () => {
    this.model.incrementSteps();
  }

  updateRecord = () => {
    this.model.updateRecord();
  }
}

export default Info;
