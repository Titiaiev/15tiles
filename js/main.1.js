window.onload = function onloadHandler() {
  class Tile {
    constructor(size) {
      this.order = Tile.getUniqId(size);
    }

    static getUniqId(max) {
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

  class Board {
    constructor(HTMLCollectionOfLi) {
      this.li = HTMLCollectionOfLi;
      this.emptyField = null;
      this.fields = [];
      this.copyOfLi = Array.from(HTMLCollectionOfLi).map(t => t.cloneNode(true));
    }

    get boardSize() {
      return this.li.length + 1;
    }

    get sideLength() {
      return Math.sqrt(this.boardSize);
    }

    init() {
      const { boardSize } = this;

      for (let i = 0; i < boardSize; i += 1) {
        if (i === boardSize - 1) {
          this.fields.push(null);
          break;
        }
        const tile = new Tile(this.boardSize - 1);
        this.fields.push(tile);
      }

      this.setEmptyPosition();

      if (!this.solvable(this.fields)) {
        console.log('solvabled');
        this.swap(0, 1);
      }

      this.render();

      console.log(this.fields);
    }

    shuffle() {
      this.init();
    }

    setEmptyPosition() {
      this.emptyField = this.fields.indexOf(null);
    }

    swap(i1, i2) {
      const t = this.fields[i1];
      this.fields[i1] = this.fields[i2];
      this.fields[i2] = t;
    }

    isCompleted() {
      return !this.fields.some((item, i) => {
        if (item) { return item.order > 0 && item.order - 1 !== i; }
      });
    }

    solvable(a) {
      for (var kDisorder = 0, i = 1, len = a.length - 1; i < len; i++) {
        for (let j = i - 1; j >= 0; j--) { if (a[j].order > a[i].order) kDisorder++; }
      }
      return !(kDisorder % 2);
    }


    moveDown() {
      const newIndex = this.emptyField - this.sideLength;
      if (newIndex >= 0) {
        this.swap(this.emptyField, newIndex);
        this.setEmptyPosition();
      }
    }

    moveUp() {
      const newIndex = this.emptyField + this.sideLength;
      if (newIndex < this.fields.length) {
        this.swap(this.emptyField, newIndex);
        this.setEmptyPosition();
      }
    }

    moveLeft() {
      const newIndex = this.emptyField + 1;
      if (newIndex < this.fields.length) {
        this.swap(this.emptyField, newIndex);
        this.setEmptyPosition();
      }
    }

    moveRight() {
      const newIndex = this.emptyField - 1;
      if (newIndex >= 0
        && this.emptyField !== this.sideLength
        && this.emptyField !== this.sideLength * 2) {
        this.swap(this.emptyField, newIndex);
        this.setEmptyPosition();
      }
    }

    render() {
      const puzzleNode = document.getElementsByClassName('puzzle')[0];
      puzzleNode.innerHTML = '';
      this.fields.forEach((f, i) => {
        if (f) {
          this.copyOfLi[f.order - 1].classList.remove('marginRight');
          this.copyOfLi[f.order - 1].classList.remove('marginLeft');
          puzzleNode.appendChild(this.copyOfLi[f.order - 1]);
          // console.log(f.order);
        } else if (this.copyOfLi[i]) {
          // this.copyOfLi[i + 1].classList.add('marginRight');
        }
      });
      if (this.emptyField === 0 || this.emptyField === 6 || this.emptyField === 3) {
        puzzleNode.getElementsByTagName('li')[this.emptyField].classList.add('marginLeft');
      } else {
        puzzleNode.getElementsByTagName('li')[this.emptyField - 1].classList.add('marginRight');
      }
      if (this.isCompleted()) {
        // this = null;
        console.log('DONE');
      }
    }
  }


  const puzzleNode = document.getElementsByClassName('puzzle')[0];
  const tiles = puzzleNode.getElementsByClassName('tile');

  const board = new Board(tiles);
  window.board = board;
  board.init();

  window.addEventListener('keydown', (e) => {
    // console.log(e.keyCode);
    switch (e.keyCode) {
      case 37: // 'left'
        board.moveLeft();
        board.render();
        break;
      case 39: // 'right'
        board.moveRight();
        board.render();
        break;
      case 38: // 'up'
        board.moveUp();
        board.render();
        break;
      case 40: // 'down'
        board.moveDown();
        board.render();
        break;
      default:
        break;
    }
  });
};
