/* eslint-disable import/extensions */
import Board from './Board.js';

window.onload = function onloadHandler() {
  const board = new Board(document.querySelector('.board'));
  window.board = board;

  window.addEventListener('keydown', (e) => {
    // board.controler.call(board, e);
    const code = e.keyCode;

    switch (code) {
      case 37: // 'left'
        board.move.call(board, 'left');
        break;
      case 39: // 'right'
        board.move.call(board, 'right');
        break;
      case 38: // 'up'
        board.move.call(board, 'up');
        break;
      case 40: // 'down'
        // console.log(board);
        board.move.call(board, 'down');
        break;
      default:
        break;
    }
  }, false);
};
