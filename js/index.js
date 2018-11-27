/* eslint-disable import/extensions */
import Board from './Board.js';

window.onload = function onloadHandler() {
  const boardNode = document.getElementsByClassName('board')[0];
  const tiles = boardNode.getElementsByClassName('tile');

  const board = new Board(tiles);
  window.board = board;

  window.addEventListener('keydown', (e) => {
    board.controler.call(board, e);
  });
};
