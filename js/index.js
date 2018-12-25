/* eslint-disable import/extensions */
import Game from './Game.js';

window.onload = function onloadHandler() {
  const openInfoBtn = document.getElementsByClassName('quastions')[0];
  const closeInfoBtn = document.querySelector('.close-btn');
  const shuffleBtn = document.getElementsByClassName('shuffle')[0];
  const table = document.querySelector('table.board');
  let timer = null;
  let keysBlocked = false;

  const game = new Game(table);
  window.game = game;


  // eslint-disable-next-line no-use-before-define
  shuffleBtn.addEventListener('click', resetGame, false);

  // eslint-disable-next-line no-use-before-define
  openInfoBtn.addEventListener('click', openInfo, false);

  // eslint-disable-next-line no-use-before-define
  closeInfoBtn.addEventListener('click', closeInfo, false);

  window.addEventListener('keydown', (e) => {
    const code = e.keyCode;
    // eslint-disable-next-line no-use-before-define
    if (code === 27 && keysBlocked) { closeInfo(); } // 'Esc'

    if (!keysBlocked) {
      switch (code) {
        case 37: // 'left'
          game.move.call(game, 'left');
          break;
        case 39: // 'right'
          game.move.call(game, 'right');
          break;
        case 38: // 'up'
          game.move.call(game, 'up');
          break;
        case 40: // 'down'
          game.move.call(game, 'down');
          break;
        default:
          break;
      }
    }
  }, false);

  game.oncompleteDo = () => {
    clearInterval(timer);
    timer = null;
    table.parentElement.parentElement.classList.add('win');
  };

  function closeInfo() {
    // eslint-disable-next-line no-use-before-define
    toggle();
    clearInterval(timer);
    timer = null;
  }

  function openInfo() {
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
    // eslint-disable-next-line no-use-before-define
    toggle();
    currentTime.textContent = game.time;
    if (!timer) {
      timer = setInterval(() => {
        currentTime.textContent = game.time;
      }, 1000);
    }

    currentSteps.textContent = game.steps;
  }

  function toggle() {
    const info = document.querySelector('.info');
    info.classList.toggle('hidden');
    keysBlocked = !keysBlocked;
  }

  function resetGame() {
    game.shuffle();
    clearInterval(timer);
    timer = null;
  }
};
