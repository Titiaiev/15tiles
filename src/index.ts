import Game from './Game.js';
import { Repeater } from './Repeater.js';

function main() {
  const repeater = new Repeater();

  // флаг блокировки обработки нажатий клавиш.
  // Нужен чтоб отключить клавиатуру когда открыта вкладка "информация"
  let keysBlocked = false;


  function openInfo() {
    const currentTime = document.querySelector('.current .time');
    const currentSteps = document.querySelector('.current .steps');
    const recordTime = document.querySelector('.record .time');
    const recordSteps = document.querySelector('.record .steps');
    // Edge бросает ошибку если открыть игру по протоколу file:// (запустить игру из проводника)
    // https://stackoverflow.com/questions/32374875/localstorage-not-working-in-edge
    try {
      if (!window.localStorage) return;

      const recorded = localStorage.getItem('game-best-result');

      if (recorded) {
        const _recorded = JSON.parse(recorded);
        recordTime.textContent = _recorded.time;
        recordSteps.textContent = _recorded.steps;
      }

      toggle();
      currentTime.textContent = game.time;
      if (!game.isCompleted) {
        repeater.start(() => {
          currentTime.textContent = game.time;
        });
      }

      currentSteps.textContent = game.steps.toString();
    } catch (err) {
      console.log(err);
    }
  };

  function closeInfo() {
    toggle();
    repeater.stop();
  };

  function toggle() {
    const info = document.querySelector('.info');
    info.classList.toggle('hidden');
    keysBlocked = !keysBlocked;
  };

  function resetGame(game: Game, repeater: Repeater) {
    game.shuffle();
    repeater.stop();
    document.querySelector('.board-container').classList.remove('win');
  };


  // запуск игры
  const game = new Game(document.querySelector('table.board'), { tilesCount: 16 });


  const openInfoBtn = document.getElementsByClassName('quastions')[0]; // информация
  const shuffleBtn = document.getElementsByClassName('shuffle')[0]; // перемешать
  const closeInfoBtn = document.querySelector('.close-btn'); // кнопка закрытия информации

  shuffleBtn.addEventListener('click', resetGame.bind(game, game, repeater), false);
  openInfoBtn.addEventListener('click', openInfo, false);
  closeInfoBtn.addEventListener('click', closeInfo, false);

  // обработка события окончания игры (победы)
  game.oncompleteDo = () => {
    repeater.stop()
    document.querySelector('.board-container').classList.add('win');
  };

  // обработка нажатий клавиш
  window.addEventListener('keydown', (e) => {
    const { keyCode } = e;
    if (keyCode === 27 && keysBlocked) { closeInfo(); } // 'Esc'

    if (!keysBlocked && keyCode >= 37 && keyCode <= 40) { game.trigger(keyCode); }
  }, false);

}


window.addEventListener('load', main);
