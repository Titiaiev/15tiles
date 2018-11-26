window.onload = function onloadHandler() {
  class Tile {
    constructor(size) {
      this.order = Tile.getUniqRandom(size);
    }

    static getUniqRandom(max) {
      const random = _max => Math.floor(1 + Math.random() * (_max));
      let i = random(max);
      if (this.randomCache.length < (max)) {
        while (this.randomCache.includes(i)) {
          i = random(max);
        }
        this.randomCache.push(i);

        // console.log(this.randomCache);
        return i;
      }
      this.randomCache = [];
      return null;
    }
  }
  Tile.randomCache = [];

  class EmptyField {
    constructor(order) {
      this.order = order;
    }
  }

  class Board {
    constructor(HTMLCollectionOfLi) {
      this.tiles = HTMLCollectionOfLi;
      this.boardSize = this.tiles.length;
      this.sideLength = Math.sqrt(this.boardSize);
      this.fields = [];
      this.emptyField = this.boardSize - 1;
      this.copyOfLi = Array.from(HTMLCollectionOfLi).map(t => t.cloneNode(true));
      this.direction = {
        up: { offset: 4, check(i) { return i < 16; } },
        down: { offset: -4, check(i) { return i >= 0; } },
        left: { offset: 1, check(i) { return i < 16 && (i !== 12 && i !== 8 && i !== 4); } },
        right: { offset: -1, check(i) { return i >= 0 && (i !== 11 && i !== 7 && i !== 3); } },
      };
      this.init();
    }

    init() {
      const { boardSize } = this;

      for (let i = 0; i < boardSize; i += 1) {
        if (i === boardSize - 1) {
          const emptyField = new EmptyField(boardSize);
          this.fields.push(emptyField);
          break;
        }
        const tile = new Tile(this.boardSize - 1);
        this.fields.push(tile);
      }


      if (!this.solvable(this.fields)) {
        // console.log('solvabled');
        this.swap(0, 1);
      }

      this.render();

      // console.log(this.fields);
    }

    shuffle() {
      this.init();
    }

    swap(i1, i2) {
      const t = this.fields[i1];
      this.fields[i1] = this.fields[i2];
      this.fields[i2] = t;
    }

    get isCompleted() {
      return !this.fields.some((item, i) => {
        if (item) {
          return item.order > 0 && item.order - 1 !== i;
        }
      });
    }

    // eslint-disable-next-line class-methods-use-this
    solvable(a) {
      // eslint-disable-next-line no-var
      var kDisorder;
      let i;
      let len;
      for (kDisorder = 0, i = 1, len = a.length - 1; i < len; i += 1) {
        // eslint-disable-next-line no-plusplus
        for (let j = i - 1; j >= 0; j--) { if (a[j].order > a[i].order) kDisorder++; }
      }
      // eslint-disable-next-line block-scoped-var
      return !(kDisorder % 2);
    }

    move(direction) {
      // console.log(this);
      const { offset, check } = direction;
      const newPosition = this.emptyField + offset;

      if (check(newPosition)) {
        this.swap(this.emptyField, newPosition);
        this.emptyField = newPosition;
      }

      this.render();
    }

    render() {
      const puzzleNode = document.getElementsByClassName('board')[0];
      puzzleNode.innerHTML = '';
      this.fields.forEach((f) => {
        if (f) {
          puzzleNode.appendChild(this.copyOfLi[f.order - 1]);
          // console.log(f.order);
        }
      });

      if (this.isCompleted) {
        // this = null;
        // eslint-disable-next-line no-alert
        alert('Головоломка сложена! Поздравляю!');
      }
    }

    // eslint-disable-next-line class-methods-use-this
    controler(e) {
      const code = e.keyCode;
      const {
        up, down, left, right,
      } = this.direction;

      switch (code) {
        case 37: // 'left'
          this.move(left);
          break;
        case 39: // 'right'
          this.move(right);
          break;
        case 38: // 'up'
          this.move(up);
          break;
        case 40: // 'down'
          // console.log(this);
          this.move(down);
          break;
        default:
          break;
      }
    }
  }


  const boardNode = document.getElementsByClassName('board')[0];
  const tiles = boardNode.getElementsByClassName('tile');

  const board = new Board(tiles);
  window.board = board;

  window.addEventListener('keydown', (e) => {
    board.controler.call(board, e);
  });
};
