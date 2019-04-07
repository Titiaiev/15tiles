class Info {
  constructor() {
    this.currentTime = document.querySelector('.current .time');
    this.currentSteps = document.querySelector('.current .steps');
    this.recordTime = document.querySelector('.record .time');
    this.recordSteps = document.querySelector('.record .steps');
    this.info = document.querySelector('.info');
    this.timerLink = null;
  }

  setInfo = (info, timerState = false) => {
    this.currentTime.textContent = info.time;
    this.currentSteps.textContent = info.steps;
    this.recordTime.textContent = info.recordedTime;
    this.recordSteps.textContent = info.recordedSteps;

    if (timerState) {
      this.timerLink = setInterval(() => {
        this.currentTime.textContent = `${Number.parseInt(this.currentTime.textContent, 10) + 1}`;
      }, 1000);
    }
  }

  hide = () => {
    this.info.classList.add('hidden');
    clearInterval(this.timerLink);
    this.timerLink = null;
  }

  show = (info, timerState = false) => {
    this.setInfo(info, timerState);
    this.info.classList.remove('hidden');
  }
}

export default Info;
