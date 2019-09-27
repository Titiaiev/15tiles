import { IPoint, IField } from './main'
import EventEmitter from './EventEmitter.js';

class Tile extends EventEmitter implements IField {
  public el: HTMLDivElement
  public id: number
  public position: IPoint

  constructor(id: number, { x, y }) {
    super();
    const el = document.createElement('div');
    el.classList.add('tile');
    el.setAttribute('unselectable', 'on');
    el.textContent = id.toString();

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

function clickOrTouchHandle(e: Event) {
  e.stopPropagation();
  e.preventDefault();
  this.emit('trymove', this); // эмитирование события - "попытка передвинуть плитку"
}

export default Tile;
