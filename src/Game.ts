import Tile from './Tile.js';
import Board from './Board.js';
// import { IField } from './main'

type Config = { tilesCount: number };

enum Direction {
  up = 'up',
  down = 'down',
  left = 'left',
  right = 'right'
}


class Game {
  private board: Board;
  private empty: Tile;
  private fields: Tile[];
  private emptyField: number;
  private gameTime: string | null;
  private timeStart: number | any;
  private _steps: number;
  private cb: () => void;
  private config: Config;


  constructor(table: HTMLTableElement, config?: Config) {

    this.board = new Board(table);
    this.empty = null;
    table.innerHTML = '';

    // this.config.tilesCount = (config && config.tilesCount) ? config.tilesCount : 16;

    this.init();
  }

  private init(): void {
    this.fields = [];
    this.emptyField = 15;
    this.timeStart = null;
    this.gameTime = null;
    this._steps = 0;

    this.fields = Tile.createDeck(16, this.tileMoveHandle);
    this.empty = this.fields[this.emptyField];
    console.log(this.empty)

    if (!this.solvable(this.fields)) {
    // console.log('_solvabled');
      this.swap(0, 1);
    }

    this.update();
  }

  public shuffle(): void {
    this.init();
  }

  // поменять местами две плитки
  private swap(i1: number, i2: number): void {
    const i1pos = this.fields[i1].position;
    const i2pos = this.fields[i2].position;
    this.fields[i1].position = i2pos;
    this.fields[i2].position = i1pos;

    const t = this.fields[i1];
    this.fields[i1] = this.fields[i2];
    this.fields[i2] = t;
  }


  // Проверить "собралась" ли игра
  get isCompleted(): boolean {
    return !this.fields.some((item, i) => item.id > 0 && item.id - 1 !== i);
  }

  get time(): string {
    if (this.gameTime) return this.gameTime;
    let delta = 0;
    let timer = '0 секунд';
    if (this.timeStart) {
      delta = (Date.now() - this.timeStart);
      timer = `${(delta / 1000).toFixed(0)} секунд`;
    }
    return timer;
  }

  get steps(): number {
    return this._steps;
  }


  get oncompleteDo() {
    return this.cb;
  }

  set oncompleteDo(fn) {
    if (typeof fn === 'function') {
      this.cb = fn;
    }
  }

  // проверить собирётся ли игра
  private solvable(a: Tile[]): boolean {
  // eslint-disable-next-line no-var
    var kDisorder: number;
    let i: number;
    let len: number;
    for (kDisorder = 0, i = 1, len = a.length - 1; i < len; i += 1) {
    // eslint-disable-next-line no-plusplus
      for (let j = i - 1; j >= 0; j--) { if (a[j].id > a[i].id) kDisorder++; }
    }
    // eslint-disable-next-line block-scoped-var
    return !(kDisorder % 2);
  }

  // проверить может ли двигаться плитка,
  // если да, то куда. Инициировать перемещение плитки
  private tileMoveHandle = (tile: Tile): void => {
    console.log(this)
    const { x, y } = tile.position;
    const deltaX = x - this.empty.position.x;
    const deltaY = y - this.empty.position.y;
    // console.log(`x === ${deltaX} && y === ${deltaY}`);
    if (deltaX === -1 && deltaY === 0) this.move(Direction.right);
    else if (deltaX === 1 && deltaY === 0) this.move(Direction.left);
    else if (deltaX === 0 && deltaY === -1) this.move(Direction.down);
    else if (deltaX === 0 && deltaY === 1) this.move(Direction.up);
  }

  // сдвинуть плитки
  private move(direction: Direction):void {
    const _direction = {
      up: { offset: 4, check(i: number) { return i < 16; } },
      down: { offset: -4, check(i: number) { return i >= 0; } },
      left: { offset: 1, check(i: number) { return i < 16 && (i !== 12 && i !== 8 && i !== 4); } },
      right: { offset: -1, check(i: number) { return i >= 0 && (i !== 11 && i !== 7 && i !== 3); } },
    };
    const { offset, check } = _direction[direction];
    const newPosition = this.emptyField + offset;

    if (check(newPosition)) {
      this.swap(this.emptyField, newPosition);
      this.emptyField = newPosition;
    }

    if (!this.timeStart) this.timeStart = Date.now();
    this._steps += 1;
    this.update();
  }

  /**
 * Обработать ход, в зависимости от переданного кода
 *
 * код от 37 до 40 (включительно)
 */
  trigger(trigger: number): void {
    const triggers = {
      37: () => this.move(Direction.left),
      39: () => this.move(Direction.right),
      38: () => this.move(Direction.up),
      40: () => this.move(Direction.down),
    }
    triggers[trigger];
  }

  private update(): void {
    const { fields } = this;
    this.board.update(fields);
    if (this.isCompleted) {
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
