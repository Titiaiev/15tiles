/* eslint-disable import/extensions */
import Tile from './Tile.js';
import EmptyField from './EmptyField.js';
import PositionGenerator from './PositionGenerator.js';
import Board from './Board.js';

const _cb = new WeakMap();

// ключи для скрытых полей
const _init = Symbol('init');
const _move = Symbol('move');
const _update = Symbol('update');
const _solvable = Symbol('solvable');
const _swap = Symbol('swap');
const _isCompleted = Symbol('isCompleted');
const _tileMoveHandle = Symbol('tileMoveHandle');
const _steps = Symbol('steps');
const _timeStart = Symbol('timeStart');

const _direction = {
  up: { offset: 4, check(i) { return i < 16; } },
  down: { offset: -4, check(i) { return i >= 0; } },
  left: { offset: 1, check(i) { return i < 16 && (i !== 12 && i !== 8 && i !== 4); } },
  right: { offset: -1, check(i) { return i >= 0 && (i !== 11 && i !== 7 && i !== 3); } },
};

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

class Game {
  constructor(table) {
    _cb.set(this, null);
    this.board = new Board(table);
    this.empty = null;
    // eslint-disable-next-line no-param-reassign
    table.innerHTML = '';

    this[_init]();
  }

  [_init]() {
    this.fields = [];
    this.emptyField = 15;
    this[_timeStart] = null;
    this.gameTime = null;
    this[_steps] = 0;

    const orders = getUniqRandom(15);
    const posgen = new PositionGenerator(3);
    // window.posgen = posgen;

    for (let i = 0; i < 15; i += 1) {
      const pos = posgen.next();
      // console.log(pos);

      const tile = new Tile(orders[i], pos);
      tile.on('trymove', this[_tileMoveHandle].bind(this));
      // console.log(tile);

      this.fields.push(tile);
    }
    this.empty = new EmptyField(posgen.next());
    this.fields.push(this.empty);
    // console.log(this.fields);


    if (!this[_solvable](this.fields)) {
    // console.log('_solvabled');
      this[_swap](0, 1);
    }

    this[_update]();
  }

  /**
 * Перемешать плитки и начать заново
 *
 * @memberof Game
 */
  shuffle() {
    this[_init]();
  }

  // поменять местами две плитки
  [_swap](i1, i2) {
    const i1pos = this.fields[i1].position;
    const i2pos = this.fields[i2].position;
    this.fields[i1].position = i2pos;
    this.fields[i2].position = i1pos;

    const t = this.fields[i1];
    this.fields[i1] = this.fields[i2];
    this.fields[i2] = t;
  }

  /**
 * Проверить "собралась" ли игра
 *
 * @readonly
 * @memberof Game
 */
  get [_isCompleted]() {
    return !this.fields.some((item, i) => item.id > 0 && item.id - 1 !== i);
  }

  get time() {
    if (this.gameTime) return this.gameTime;
    let delta = 0;
    let timer = '0 секунд';
    if (this[_timeStart]) {
      delta = (Date.now() - this[_timeStart]);
      timer = `${(delta / 1000).toFixed(0)} секунд`;
    }
    return timer;
  }

  get steps() {
    return this[_steps];
  }


  get oncompleteDo() {
    return _cb.get(this);
  }

  set oncompleteDo(fn) {
    if (typeof fn === 'function') {
      _cb.set(this, fn);
    }

    return _cb.get(this);
  }

  // проверить собирётся ли игра
  // eslint-disable-next-line class-methods-use-this
  [_solvable](a) {
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

  // проверить может ли двигаться плитка,
  // если да, то куда. Инициировать перемещение плитки
  [_tileMoveHandle](tile) {
    const { x, y } = tile.position;
    const deltaX = x - this.empty.position.x;
    const deltaY = y - this.empty.position.y;
    // console.log(`x === ${deltaX} && y === ${deltaY}`);
    if (deltaX === -1 && deltaY === 0) this[_move]('right');
    else if (deltaX === 1 && deltaY === 0) this[_move]('left');
    else if (deltaX === 0 && deltaY === -1) this[_move]('down');
    else if (deltaX === 0 && deltaY === 1) this[_move]('up');
  }

  // сдвинуть плитки
  [_move](direction) {
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
        this[_swap](this.emptyField, newPosition);
        this.emptyField = newPosition;
      }

      if (!this[_timeStart]) this[_timeStart] = Date.now();
      this[_steps] += 1;
      this[_update]();
    } else throw new RangeError('Недопустимый аргумент! Метод принимает только: up, down, left, right.');
  }

  /**
 * Обработать ход, в зависимости от переданного кода
 *
 * код от 37 до 40 (включительно)
 *
 * @param {number} trigger
 * @memberof Game
 */
  trigger(trigger) {
    switch (trigger) {
      case 37: // 'left'
        this[_move]('left');
        break;
      case 39: // 'right'
        this[_move]('right');
        break;
      case 38: // 'up'
        this[_move]('up');
        break;
      case 40: // 'down'
        this[_move]('down');
        break;
      default:
        break;
    }
  }

  [_update]() {
    const { fields } = this;
    this.board.update(fields);
    if (this[_isCompleted]) {
      console.log('Головоломка сложена! Поздравляю!');
      this.gameTime = this.time;

      try { // Edge бросает ошибку если открыть игру по протоколу file:// (запустить игру из проводника)
        const recorded = JSON.parse(localStorage.getItem('game-best-result'));
        const now = {
          time: this.time,
          steps: this.steps,
        };

        if (recorded) {
          now.time = (Number(now.time.split(' ')[0]) < Number(recorded.time.split(' ')[0])) ? now.time : recorded.time;
          now.steps = (Number(now.steps) < Number(recorded.steps)) ? now.steps : recorded.steps;
        }
        console.log(now);
        localStorage.setItem('game-best-result', JSON.stringify(now));

        if (this.oncompleteDo) this.oncompleteDo();
      } catch (err) {
        console.log(err);
      }
    }
  }
}

export default Game;
