window.onload = function onloadHandler() {
  class Tile {
    constructor({ x, y }, nodeList) {
      this.position = {
        x,
        y,
      };
      // this._nodeList = nodeList;
      this.id = Tile.getUniqId(nodeList.length);
    // Tile.instanceCounter += 1;
    }

    // get id() {
    //   return Tile.getUniqId(8);
    // }

    // get HTMLnode() {
    //   return this._nodeList[this.id - 1];
    // }

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
  // Tile.instanceCounter = 0;
  Tile.randomCache = [];

  class EmptyField {
    constructor(boardSize) {
      const lastPoint = Math.sqrt(boardSize) - 1;
      this.position = {
        x: lastPoint,
        y: lastPoint,
      };
      this.id = boardSize;
      this.isEmpty = true;
    }
  }

  class PositionGenerator {
    constructor(max) {
      this._max = max;
      this._x = 0;
      this._y = 0;
    }

    next() {
      const { _x, _y, _max } = this;
      if (_x < _max) {
        this._x += 1;
      } else if (_y < _max) {
        this._y += 1;
        this._x = 0;
      } else {
        this._x = 0;
        this._y = 0;
      }

      return {
        x: _x,
        y: _y,
      };
    }
  }
  // eslint-disable-next-line func-names
  const PuzzleBoard = (function () {
    // eslint-disable-next-line class-methods-use-this
    const insertTile = (tile, arr) => {
      // eslint-disable-next-line no-param-reassign
      arr[tile.position.y][tile.position.x] = tile;
    };

    const findTile = (x, y, fields) => {
      let found = null;
      fields.forEach((field) => {
        if (field.position.x === x && field.position.y === y) {
          found = field;
        }
      });
      return found;
    };

    // eslint-disable-next-line no-shadow
    return class PuzzleBoard {
      constructor(HTMLCollectionOfLi) {
        this.li = HTMLCollectionOfLi;
        this.emptyField = null;

        this.fields = [];
        // for (let i = 0; i < this.sideLength; i += 1) {
        //   this.fields.push([]);
        // }
        this.copyOfLi = Array.from(HTMLCollectionOfLi).map(t => t.cloneNode(true));
        console.log(this.copyOfLi);
      }

      get boardSize() {
        return this.li.length + 1;
      }

      get sideLength() {
        return Math.sqrt(this.boardSize);
      }

      init() {
        const { boardSize } = this;
        const xy = new PositionGenerator(this.sideLength - 1);
        const emptyField = new EmptyField(boardSize);
        this.emptyField = emptyField;


        for (let i = 0; i < boardSize; i += 1) {
          if (i === boardSize - 1) {
            this.fields.push(emptyField);
            break;
          }
          const tile = new Tile(xy.next(), this.li);
          this.fields.push(tile);
        }

        this.fields.forEach((field) => {

        });

        console.log(this.fields);
      }

      shuffle() {
        this.init();
      }


      moveDown() {
        const { x, y } = this.emptyField.position;
        if (y >= 0 && y < this.sideLength - 1) {
          const downTile = findTile(x, y + 1, this.fields);
          this.emptyField.position.y += 1;
          if (downTile) downTile.position.y -= 1;
          console.log(downTile);
        }
        // this.render();
      }

      moveUp() {
        const { x, y } = this.emptyField.position;
        if (y > 0) {
          const upTile = findTile(x, y - 1, this.fields);
          this.emptyField.position.y -= 1;
          if (upTile) upTile.position.y += 1;
          console.log(upTile);
        }
        // this.render();
      }

      moveLeft() {
        const { x, y } = this.emptyField.position;
        if (x > 0) {
          const leftTile = findTile(x - 1, y, this.fields);
          this.emptyField.position.x -= 1;
          if (leftTile) leftTile.position.x += 1;
        // console.log(leftTile);
        }
        // this.render();
      }

      moveRight() {
        const { x, y } = this.emptyField.position;
        if (x >= 0 && x < this.sideLength - 1) {
          const rightTile = findTile(x + 1, y, this.fields);
          this.emptyField.position.x += 1;
          if (rightTile) rightTile.position.x -= 1;
        // console.log(rightTile);
        }
        // this.render();
      }

      render() {
        const arr = [[], [], []];
        // const puzzleNode = document.getElementsByClassName('puzzle')[0];
        // const tiles = puzzleNode.getElementsByClassName('tile');

        this.fields.forEach((field, i) => {
          insertTile(field, arr);
        // if (i === 8) return;
        // tiles[i].innerHTML = field.id;
        });
        console.dir(arr);

        const puzzleNode = document.getElementsByClassName('puzzle')[0];
        puzzleNode.innerHTML = '';
        this.fields.forEach((f) => {
          if (!f.isEmpty) {
            puzzleNode.appendChild(this.copyOfLi[f.id - 1]);
            console.log(f.id);
          }
        });
      }
    };
  }());


  const puzzleNode = document.getElementsByClassName('puzzle')[0];
  const tiles = puzzleNode.getElementsByClassName('tile');

  // const tilesCopy = Array.from(tiles).map(t => t);
  // puzzleNode.innerHTML = '';
  // tilesCopy.reverse();
  // tilesCopy.forEach((t) => {
  //   puzzleNode.appendChild(t);
  // });
  // console.log(tilesCopy);

  const board = new PuzzleBoard(tiles);
  window.board = board;
  board.init();

  window.addEventListener('keydown', (e) => {
    switch (e.keyCode) {
      case 39: // 'left'
        board.moveLeft();
        board.render();
        break;
      case 37: // 'right'
        board.moveRight();
        board.render();
        break;
      case 40: // 'up'
        board.moveUp();
        board.render();
        break;
      case 38: // 'down'
        board.moveDown();
        board.render();
        break;
      default:
        break;
    }
  });
};
