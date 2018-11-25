"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

window.onload = function onloadHandler() {
  var Tile =
  /*#__PURE__*/
  function () {
    function Tile(_ref, nodeList) {
      var x = _ref.x,
          y = _ref.y;

      _classCallCheck(this, Tile);

      this.position = {
        x: x,
        y: y
      }; // this._nodeList = nodeList;

      this.id = Tile.getUniqId(nodeList.length); // Tile.instanceCounter += 1;
    } // get id() {
    //   return Tile.getUniqId(8);
    // }
    // get HTMLnode() {
    //   return this._nodeList[this.id - 1];
    // }


    _createClass(Tile, null, [{
      key: "getUniqId",
      value: function getUniqId(max) {
        var random = function random(_max) {
          return Math.floor(1 + Math.random() * _max);
        };

        var i = random(max);

        if (this.randomCache.length < max) {
          while (this.randomCache.includes(i)) {
            i = random(max);
          }

          this.randomCache.push(i); // console.log(this.randomCache);

          return i;
        }

        this.randomCache = [];
        return null;
      }
    }]);

    return Tile;
  }(); // Tile.instanceCounter = 0;


  Tile.randomCache = [];

  var EmptyField = function EmptyField(boardSize) {
    _classCallCheck(this, EmptyField);

    var lastPoint = Math.sqrt(boardSize) - 1;
    this.position = {
      x: lastPoint,
      y: lastPoint
    };
    this.id = boardSize;
    this.isEmpty = true;
  };

  var PositionGenerator =
  /*#__PURE__*/
  function () {
    function PositionGenerator(max) {
      _classCallCheck(this, PositionGenerator);

      this._max = max;
      this._x = 0;
      this._y = 0;
    }

    _createClass(PositionGenerator, [{
      key: "next",
      value: function next() {
        var _x = this._x,
            _y = this._y,
            _max = this._max;

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
          y: _y
        };
      }
    }]);

    return PositionGenerator;
  }(); // eslint-disable-next-line func-names


  var PuzzleBoard = function () {
    // eslint-disable-next-line class-methods-use-this
    var insertTile = function insertTile(tile, arr) {
      // eslint-disable-next-line no-param-reassign
      arr[tile.position.y][tile.position.x] = tile;
    };

    var findTile = function findTile(x, y, fields) {
      var found = null;
      fields.forEach(function (field) {
        if (field.position.x === x && field.position.y === y) {
          found = field;
        }
      });
      return found;
    }; // eslint-disable-next-line no-shadow


    return (
      /*#__PURE__*/
      function () {
        function PuzzleBoard(HTMLCollectionOfLi) {
          _classCallCheck(this, PuzzleBoard);

          this.li = HTMLCollectionOfLi;
          this.emptyField = null;
          this.fields = []; // for (let i = 0; i < this.sideLength; i += 1) {
          //   this.fields.push([]);
          // }

          this.copyOfLi = Array.from(HTMLCollectionOfLi).map(function (t) {
            return t.cloneNode(true);
          });
          console.log(this.copyOfLi);
        }

        _createClass(PuzzleBoard, [{
          key: "init",
          value: function init() {
            var boardSize = this.boardSize;
            var xy = new PositionGenerator(this.sideLength - 1);
            var emptyField = new EmptyField(boardSize);
            this.emptyField = emptyField;

            for (var i = 0; i < boardSize; i += 1) {
              if (i === boardSize - 1) {
                this.fields.push(emptyField);
                break;
              }

              var tile = new Tile(xy.next(), this.li);
              this.fields.push(tile);
            }

            this.fields.forEach(function (field) {});
            console.log(this.fields);
          }
        }, {
          key: "shuffle",
          value: function shuffle() {
            this.init();
          }
        }, {
          key: "moveDown",
          value: function moveDown() {
            var _this$emptyField$posi = this.emptyField.position,
                x = _this$emptyField$posi.x,
                y = _this$emptyField$posi.y;

            if (y >= 0 && y < this.sideLength - 1) {
              var downTile = findTile(x, y + 1, this.fields);
              this.emptyField.position.y += 1;
              if (downTile) downTile.position.y -= 1;
              console.log(downTile);
            } // this.render();

          }
        }, {
          key: "moveUp",
          value: function moveUp() {
            var _this$emptyField$posi2 = this.emptyField.position,
                x = _this$emptyField$posi2.x,
                y = _this$emptyField$posi2.y;

            if (y > 0) {
              var upTile = findTile(x, y - 1, this.fields);
              this.emptyField.position.y -= 1;
              if (upTile) upTile.position.y += 1;
              console.log(upTile);
            } // this.render();

          }
        }, {
          key: "moveLeft",
          value: function moveLeft() {
            var _this$emptyField$posi3 = this.emptyField.position,
                x = _this$emptyField$posi3.x,
                y = _this$emptyField$posi3.y;

            if (x > 0) {
              var leftTile = findTile(x - 1, y, this.fields);
              this.emptyField.position.x -= 1;
              if (leftTile) leftTile.position.x += 1; // console.log(leftTile);
            } // this.render();

          }
        }, {
          key: "moveRight",
          value: function moveRight() {
            var _this$emptyField$posi4 = this.emptyField.position,
                x = _this$emptyField$posi4.x,
                y = _this$emptyField$posi4.y;

            if (x >= 0 && x < this.sideLength - 1) {
              var rightTile = findTile(x + 1, y, this.fields);
              this.emptyField.position.x += 1;
              if (rightTile) rightTile.position.x -= 1; // console.log(rightTile);
            } // this.render();

          }
        }, {
          key: "render",
          value: function render() {
            var _this = this;

            var arr = [[], [], []]; // const puzzleNode = document.getElementsByClassName('puzzle')[0];
            // const tiles = puzzleNode.getElementsByClassName('tile');

            this.fields.forEach(function (field, i) {
              insertTile(field, arr); // if (i === 8) return;
              // tiles[i].innerHTML = field.id;
            });
            console.dir(arr);
            var puzzleNode = document.getElementsByClassName('puzzle')[0];
            puzzleNode.innerHTML = '';
            this.fields.forEach(function (f) {
              if (!f.isEmpty) {
                puzzleNode.appendChild(_this.copyOfLi[f.id - 1]);
                console.log(f.id);
              }
            });
          }
        }, {
          key: "boardSize",
          get: function get() {
            return this.li.length + 1;
          }
        }, {
          key: "sideLength",
          get: function get() {
            return Math.sqrt(this.boardSize);
          }
        }]);

        return PuzzleBoard;
      }()
    );
  }();

  var puzzleNode = document.getElementsByClassName('puzzle')[0];
  var tiles = puzzleNode.getElementsByClassName('tile'); // const tilesCopy = Array.from(tiles).map(t => t);
  // puzzleNode.innerHTML = '';
  // tilesCopy.reverse();
  // tilesCopy.forEach((t) => {
  //   puzzleNode.appendChild(t);
  // });
  // console.log(tilesCopy);

  var board = new PuzzleBoard(tiles);
  window.board = board;
  board.init();
  window.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
      case 39:
        // 'left'
        board.moveLeft();
        board.render();
        break;

      case 37:
        // 'right'
        board.moveRight();
        board.render();
        break;

      case 40:
        // 'up'
        board.moveUp();
        board.render();
        break;

      case 38:
        // 'down'
        board.moveDown();
        board.render();
        break;

      default:
        break;
    }
  });
};