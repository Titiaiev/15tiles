// eslint-disable-next-line import/extensions
import EventEmitter from './EventEmitter.js';

/**
 * Представляет плитку, которая имеет номер от 1 до 15
 *
 * @class Tile
 * @extends {EventEmitter}
 * @param {number} id
 * @param {object} { x: [0 - 3], y: [0 - 3] }
 * @returns {HTMLDivElement} <div class="tile" unselectable="on">[ 0 -- 15 ]</div>
 */
class Tile extends EventEmitter {
  constructor(id, { x, y }) {
    super();
    const el = document.createElement('div');
    el.classList.add('tile');
    el.setAttribute('unselectable', 'on');
    el.textContent = id;

    // eslint-disable-next-line no-use-before-define
    el.addEventListener('click', clickOrTouchHandle.bind(this), false);
    // eslint-disable-next-line no-use-before-define
    el.addEventListener('touchend', clickOrTouchHandle.bind(this), false);

    this.el = el;
    this.id = id;
    this.position = {
      x,
      y,
    };
  }
}

function clickOrTouchHandle(e) {
  e.stopPropagation();
  e.preventDefault();
  this.emit('trymove', this); // эмитирование события - "попытка передвинуть плитку"
}

export default Tile;
