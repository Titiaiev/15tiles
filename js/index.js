/* eslint-disable import/extensions */
import Game from './Game.js';

window.onload = function onloadHandler() {
  const game = new Game(document.querySelector('table.board'));
  window.game = game;

  // const btns = document.getElementsByTagName('button');

  document.getElementsByClassName('shuffle')[0].addEventListener('click', () => {
    game.shuffle();
  }, false);

  window.addEventListener('keydown', (e) => {
    // board.controler.call(board, e);
    const code = e.keyCode;

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
        // console.log(board);
        game.move.call(game, 'down');
        break;
      default:
        break;
    }
  }, false);
};
