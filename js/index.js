/* eslint-disable import/extensions */
import Game from './Game.js';


window.onload = function onloadHandler() {
  // запуск игры
  const game = new Game(document.querySelector('table.board'));

  // app - представляет интерфейс приложения
  const app = {
    openInfoBtn: document.getElementsByClassName('quastions')[0], // информация
    shuffleBtn: document.getElementsByClassName('shuffle')[0], // перемешать
    closeInfoBtn: document.querySelector('.close-btn'), // кнопка закрытия информации
    timer: null, // ссылка на setInterval, нужна для очистки
    // флаг блокировки обработки нажатий клавиш.
    // Нужен чтоб отключить клавиатуру когда открыта вкладка "информация"
    keysBlocked: false,
    game,
    gameCompleted: false,

    openInfo() {
      // Edge бросает ошибку если открыть игру по протоколу file:// (запустить игру из проводника)
      // https://stackoverflow.com/questions/32374875/localstorage-not-working-in-edge
      try {
        if (!window.localStorage) return;
        const currentTime = document.querySelector('.current .time');
        const currentSteps = document.querySelector('.current .steps');
        const recordTime = document.querySelector('.record .time');
        const recordSteps = document.querySelector('.record .steps');

        const recorded = localStorage.getItem('game-best-result');

        if (recorded) {
          const _recorded = JSON.parse(recorded);
          recordTime.textContent = _recorded.time;
          recordSteps.textContent = _recorded.steps;
        }

        app.toggle();
        currentTime.textContent = app.game.time;
        if (!app.timer && !app.gameCompleted) {
          app.timer = setInterval(() => {
            currentTime.textContent = app.game.time;
          }, 1000);
        }

        currentSteps.textContent = app.game.steps;
      } catch (err) {
        console.log(err);
      }
    },

    closeInfo() {
      app.toggle();
      clearInterval(app.timer);
      app.timer = null;
    },

    toggle() {
      const info = document.querySelector('.info');
      info.classList.toggle('hidden');
      app.keysBlocked = !app.keysBlocked;
    },

    resetGame() {
      app.game.shuffle();
      clearInterval(app.timer);
      app.timer = null;
    },

  };

  app.shuffleBtn.addEventListener('click', app.resetGame, false);
  app.openInfoBtn.addEventListener('click', app.openInfo, false);
  app.closeInfoBtn.addEventListener('click', app.closeInfo, false);

  // обработка нажатий клавиш
  window.addEventListener('keydown', (e) => {
    const code = e.keyCode;
    // eslint-disable-next-line no-use-before-define
    if (code === 27 && app.keysBlocked) { app.closeInfo(); } // 'Esc'

    if (!app.keysBlocked && code >= 37 && code <= 40) { game.trigger(code); }
  }, false);

  // обработка события окончания игры (победы)
  game.oncompleteDo = () => {
    clearInterval(app.timer);
    app.timer = null;
    app.gameCompleted = true;
    document.querySelector('.board-container').classList.add('win');
  };
};
