/* eslint-disable import/extensions */
import Board from './Board.js';

window.onload = function onloadHandler() {
  const boardNode = document.getElementsByClassName('board')[0];
  const tiles = boardNode.getElementsByClassName('tile');

  const board = new Board(tiles);
  window.board = board;

  const controls = document.getElementsByClassName('controls')[0];
  // const shuffle = controls.querySelector('button.shuffle');
  // const upBtn = controls.querySelector('button.up');
  // const downBtn = controls.querySelector('button.down');
  // const leftBtn = controls.querySelector('button.left');
  // const rightBtn = controls.querySelector('button.right');

  controls.addEventListener('click', (e) => {
    // console.log(e);
    board.controler.call(board, e);
  }, false);

  window.addEventListener('keydown', (e) => {
    board.controler.call(board, e);
  }, false);
};
