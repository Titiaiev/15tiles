/* eslint-disable import/extensions */
import models from './models/index.js';
import views from './views/index.js';
import controllers from './controllers/index.js';

export default {
  start() {
    this.main();
    this.events(this.board, this.info);
  },

  main() {
    const table = document.querySelector('table.board');


    this.info = new controllers.Info(
      new models.Info(),
      new views.Info(),
    );

    this.board = new controllers.Board(
      new models.Board(),
      new views.Board(table),
    );

    // window.info = this.info;
    // window.board = this.board;
  },

  events(board, info) {
    // #region BUTTONS HANDLE
    const openInfoBtn = document.getElementsByClassName('quastions')[0]; // информация
    const shuffleBtn = document.getElementsByClassName('shuffle')[0]; // перемешать
    const closeInfoBtn = document.querySelector('.close-btn'); // кнопка закрытия информации

    shuffleBtn.addEventListener('click', board.shuffle, false);
    openInfoBtn.addEventListener('click', info.openInfo, false);
    closeInfoBtn.addEventListener('click', info.closeInfo, false);
    // #endregion BUTTONS HANDLE

    // #region CONTROLLER EVENTS HANDLE
    board.on('new-game', info.startTimer);
    board.on('step', info.incrementSteps);
    board.on('reboot-game', info.resetTimer);
    board.on('finish-game', info.updateRecord);
    // #endregion CONTROLLER EVENTS HANDLE

    // #region KEYBOARD EVENTS HANDLE
    // обработка нажатий клавиш
    window.addEventListener('keydown', (e) => {
      const code = e.keyCode;
      if (code === 27 && info.keysBlocked) { info.closeInfo(); } // 'Esc'

      if (!info.keysBlocked && code >= 37 && code <= 40) {
        board.trigger(code);
      }
    }, false);
    // #endregion KEYBOARD EVENTS HANDLE
  },
};
