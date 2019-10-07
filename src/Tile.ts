import { IPoint } from './main'
import EventEmitter from './EventEmitter.js';
import PositionGenerator from './PositionGenerator.js';

const getUniqRandom = function (max: number): number[] {
  const uniqs: number[] = [];

  const random = (max: number) => Math.floor(1 + Math.random() * (max));
  let i = random(max);

  while (uniqs.length < (max)) {
    while (uniqs.indexOf(i) !== -1) {
      i = random(max);
    }
    uniqs.push(i);
  }
  uniqs.push(0)
  console.log(uniqs);
  return uniqs;
};

class Tile extends EventEmitter {
  public el: HTMLDivElement
  public id: number
  public position: IPoint

  constructor(id: number, { x, y }: IPoint) {
    super();
    const el = document.createElement('div');
    el.classList.add('tile');
    if (id === 0) el.classList.add('empty');
    el.setAttribute('unselectable', 'on');
    el.textContent = id > 0 ? id.toString(): '';

    if (id > 0) {
      el.addEventListener('touchend', clickOrTouchHandle.bind(this), false);
      el.addEventListener('click', clickOrTouchHandle.bind(this), false);
    }

    this.el = el;
    this.id = id;
    this.position = {
      x,
      y,
    };
  }

  static createDeck(count: number, tileMoveHandle): Tile[] {
    const deck: Tile[] = [];
    const orders = getUniqRandom(count - 1);
    const posgen = new PositionGenerator(Math.sqrt(count) - 1);
    // window.posgen = posgen;

    for (let i = 0; i < count; i += 1) {
      const pos = posgen.next();
      // console.log(pos);

      const tile = new Tile(orders[i], pos);
      tile.on('trymove', tileMoveHandle);
      // console.log(tile);

      deck.push(tile);
    }
    return deck;
  }
}

function clickOrTouchHandle(e: Event) {
  e.stopPropagation();
  e.preventDefault();
  this.emit('trymove', this); // эмитирование события - "попытка передвинуть плитку"
}

export default Tile;
