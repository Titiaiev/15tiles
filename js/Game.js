/* eslint-disable import/extensions */
import Tile from './Tile.js';
import EmptyField from './EmptyField.js';
import PositionGenerator from './PositionGenerator.js';
import Board from './Board.js';

const cb = new WeakMap();

const _direction = {
  up: { offset: 4, check(i) { return i < 16; } },
  down: { offset: -4, check(i) { return i >= 0; } },
  left: { offset: 1, check(i) { return i < 16 && (i !== 12 && i !== 8 && i !== 4); } },
  right: { offset: -1, check(i) { return i >= 0 && (i !== 11 && i !== 7 && i !== 3); } },
};

class Game {
  constructor(table) {
    this.board = new Board(table);
    // eslint-disable-next-line no-param-reassign
    table.innerHTML = '';
    cb.set(this, null);

    this.fields = [];
    this.emptyField = 15;
    this.empty = null;

    this.init();
  }

  init() {
    this.fields = [];
    this.emptyField = 15;
    this._timeStart = null;
    this._steps = 0;

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

    const orders = getUniqRandom(15);
    const posgen = new PositionGenerator(3);
    // window.posgen = posgen;

    for (let i = 0; i < 15; i += 1) {
      const pos = posgen.next();
      // console.log(pos);
      const tile = new Tile(orders[i], pos, this);
      // console.log(tile);
      this.fields.push(tile);
    }
    this.empty = new EmptyField(posgen.next());
    this.fields.push(this.empty);
    // console.log(this.fields);


    if (!this.solvable(this.fields)) {
    // console.log('solvabled');
      this.swap(0, 1);
    }

    this.render();
  }

  shuffle() {
    this.init();
  }

  swap(i1, i2) {
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

  get time() {
    let delta = 0;
    let timer = '0 секунд';
    if (this._timeStart) {
      delta = (Date.now() - this._timeStart);
      timer = `${(delta / 1000).toFixed(0)} секунд`;
    }
    return timer;
  }

  get steps() {
    return this._steps;
  }

  // eslint-disable-next-line class-methods-use-this
  get oncompleteDo() {
    return cb.get(this);
  }

  set oncompleteDo(fn) {
    if (typeof fn === 'function') {
      cb.set(this, fn);
    }

    return cb.get(this);
  }

  // eslint-disable-next-line class-methods-use-this
  solvable(a) {
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

  move(direction) {
  // console.log(this);
    if (
      direction === 'up'
      || direction === 'down'
      || direction === 'left'
      || direction === 'right'
    ) {
      const { offset, check } = _direction[direction];
      const newPosition = this.emptyField + offset;

      if (check(newPosition)) {
        this.swap(this.emptyField, newPosition);
        this.emptyField = newPosition;
      }

      if (!this._timeStart) this._timeStart = Date.now();
      this._steps += 1;
      this.render();
    } else throw new RangeError('Недопустимый аргумент! Метод принимает только: up, down, left, right.');
  }

  render() {
    const { fields } = this;
    this.board.update(fields);
    if (this.isCompleted) {
      console.log('Головоломка сложена! Поздравляю!');

      const _recorded = localStorage.getItem('game-best-result');
      const recorded = JSON.parse(_recorded);
      const now = {
        time: this.time,
        steps: this.steps,
      };

      if (_recorded) {
        now.time = (now.time.split(' ')[0] < recorded.time.split(' ')[0]) ? now.time : recorded.time;
        now.steps = (now.steps < recorded.steps) ? now.steps : recorded.steps;
      }
      localStorage.setItem('game-best-result', JSON.stringify(now));

      if (this.oncompleteDo) this.oncompleteDo();
    }
  }
}

export default Game;
