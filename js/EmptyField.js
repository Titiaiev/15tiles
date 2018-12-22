/* eslint-disable import/extensions */
import Tile from './Tile.js';

class EmptyField extends Tile {
  constructor({ x, y }) {
    super(16, { x, y });
    this.el.textContent = '';
    this.el.classList.add('empty');
  }
}

export default EmptyField;
