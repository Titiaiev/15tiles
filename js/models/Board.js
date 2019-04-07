/* eslint-disable import/extensions */
import PositionGenerator from '../libs/PositionGenerator.js';
import Tile from '../libs/Tile.js';
import EmptyField from '../libs/EmptyField.js';
import EventEmitter from '../libs/EventEmitter.js';

const getUniqRandom = function getUniqRandom(max) {
  const uniqs = [];

  const random = _max => Math.floor(1 + Math.random() * (_max));
  let i = random(max);

  while (uniqs.length < (max)) {
    while (uniqs.includes(i)) {
      i = random(max);
    }
    uniqs.push(i);
  // getUniqRandom(max);
  }
  return uniqs;
};

const directions = {
  up: { offset: 4, check(i) { return i < 16; } },
  down: { offset: -4, check(i) { return i >= 0; } },
  left: { offset: 1, check(i) { return i < 16 && (i !== 12 && i !== 8 && i !== 4); } },
  right: { offset: -1, check(i) { return i >= 0 && (i !== 11 && i !== 7 && i !== 3); } },
};

// events - ['updated', 'completed']
class Board extends EventEmitter {
  constructor() {
    super();
    this._init();
  }

  _init() {
    this.empty = null;
    this.fields = [];
    this.emptyField = 15;

    const orders = getUniqRandom(15);
    const posgen = new PositionGenerator(3);

    for (let i = 0; i < 15; i += 1) {
      const pos = posgen.next();
      // console.log(pos);

      const tile = new Tile(orders[i], pos);
      tile.on('trymove', this._tileMoveHandle.bind(this));
      // tile.on('trymove', console.log);
      // console.log(tile);

      this.fields.push(tile);
    }
    this.empty = new EmptyField(posgen.next());
    this.fields.push(this.empty);
    // console.log(this.fields);

    if (!this._solvable(this.fields)) {
      this._swap(0, 1);
    }

    this.doItOnceOnFirstMove = (cb) => {
      if (typeof cb === 'function') cb();
      this.doItOnceOnFirstMove = () => {};
    };

    this.emit('updated', this.fields);
  }

  // проверить собирётся ли игра
  // eslint-disable-next-line class-methods-use-this
  _solvable(a) {
    // eslint-disable-next-line no-var
    var kDisorder;
    let i;
    let len;
    for (kDisorder = 0, i = 1, len = a.length - 1; i < len; i += 1) {
      // eslint-disable-next-line no-plusplus
      for (let j = i - 1; j >= 0; j--) { if (a[j].id > a[i].id) kDisorder++; }
    }
    // eslint-disable-next-line block-scoped-var
    return !(kDisorder % 2);
  }

  shuffle() {
    this._init();
  }

  // поменять местами две плитки
  _swap(i1, i2) {
    const i1pos = this.fields[i1].position;
    const i2pos = this.fields[i2].position;
    this.fields[i1].position = i2pos;
    this.fields[i2].position = i1pos;

    const t = this.fields[i1];
    this.fields[i1] = this.fields[i2];
    this.fields[i2] = t;
  }

  get isCompleted() {
    return !this.fields.some((item, i) => item.id > 0 && item.id - 1 !== i);
  }

  // проверить может ли двигаться плитка,
  // если да, то куда. Инициировать перемещение плитки
  _tileMoveHandle(tile) {
    const { x, y } = tile.position;
    const deltaX = x - this.empty.position.x;
    const deltaY = y - this.empty.position.y;
    // console.log(`x === ${deltaX} && y === ${deltaY}`);
    if (deltaX === -1 && deltaY === 0) this.move('right');
    else if (deltaX === 1 && deltaY === 0) this.move('left');
    else if (deltaX === 0 && deltaY === -1) this.move('down');
    else if (deltaX === 0 && deltaY === 1) this.move('up');
  }

  // сдвинуть плитки
  move(direction) {
  // console.log(this);
    if (
      direction === 'up'
      || direction === 'down'
      || direction === 'left'
      || direction === 'right'
    ) {
      const { offset, check } = directions[direction];
      const newPosition = this.emptyField + offset;

      if (check(newPosition)) {
        this._swap(this.emptyField, newPosition);
        this.emptyField = newPosition;

        this.doItOnceOnFirstMove(() => this.emit('started', null));
        this.emit('updated', this.fields);
        if (this.isCompleted) this.emit('completed', this.fields);
      }
    } else throw new RangeError('Недопустимый аргумент! Метод принимает только: up, down, left, right.');
  }
}

export default Board;
