"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

window.onload = function onloadHandler() {
  var Tile =
  /*#__PURE__*/
  function () {
    function Tile(size) {
      _classCallCheck(this, Tile);

      this.order = Tile.getUniqId(size);
    }

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
  }();

  Tile.randomCache = [];

  var Board =
  /*#__PURE__*/
  function () {
    function Board(HTMLCollectionOfLi) {
      _classCallCheck(this, Board);

      this.li = HTMLCollectionOfLi;
      this.emptyField = null;
      this.fields = [];
      this.copyOfLi = Array.from(HTMLCollectionOfLi).map(function (t) {
        return t.cloneNode(true);
      });
    }

    _createClass(Board, [{
      key: "init",
      value: function init() {
        var boardSize = this.boardSize;

        for (var i = 0; i < boardSize; i += 1) {
          if (i === boardSize - 1) {
            this.fields.push(null);
            break;
          }

          var tile = new Tile(this.boardSize - 1);
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
    }, {
      key: "shuffle",
      value: function shuffle() {
        this.init();
      }
    }, {
      key: "setEmptyPosition",
      value: function setEmptyPosition() {
        this.emptyField = this.fields.indexOf(null);
      }
    }, {
      key: "swap",
      value: function swap(i1, i2) {
        var t = this.fields[i1];
        this.fields[i1] = this.fields[i2];
        this.fields[i2] = t;
      }
    }, {
      key: "isCompleted",
      value: function isCompleted() {
        return !this.fields.some(function (item, i) {
          if (item) {
            return item.order > 0 && item.order - 1 !== i;
          }
        });
      }
    }, {
      key: "solvable",
      value: function solvable(a) {
        for (var kDisorder = 0, i = 1, len = a.length - 1; i < len; i++) {
          for (var j = i - 1; j >= 0; j--) {
            if (a[j].order > a[i].order) kDisorder++;
          }
        }

        return !(kDisorder % 2);
      }
    }, {
      key: "moveDown",
      value: function moveDown() {
        var newIndex = this.emptyField - this.sideLength;

        if (newIndex >= 0) {
          this.swap(this.emptyField, newIndex);
          this.setEmptyPosition();
        }
      }
    }, {
      key: "moveUp",
      value: function moveUp() {
        var newIndex = this.emptyField + this.sideLength;

        if (newIndex < this.fields.length) {
          this.swap(this.emptyField, newIndex);
          this.setEmptyPosition();
        }
      }
    }, {
      key: "moveLeft",
      value: function moveLeft() {
        var newIndex = this.emptyField + 1;

        if (newIndex < this.fields.length) {
          this.swap(this.emptyField, newIndex);
          this.setEmptyPosition();
        }
      }
    }, {
      key: "moveRight",
      value: function moveRight() {
        var newIndex = this.emptyField - 1;

        if (newIndex >= 0 && this.emptyField !== this.sideLength && this.emptyField !== this.sideLength * 2) {
          this.swap(this.emptyField, newIndex);
          this.setEmptyPosition();
        }
      }
    }, {
      key: "render",
      value: function render() {
        var _this = this;

        var puzzleNode = document.getElementsByClassName('puzzle')[0];
        puzzleNode.innerHTML = '';
        this.fields.forEach(function (f, i) {
          if (f) {
            _this.copyOfLi[f.order - 1].classList.remove('marginRight');

            _this.copyOfLi[f.order - 1].classList.remove('marginLeft');

            puzzleNode.appendChild(_this.copyOfLi[f.order - 1]); // console.log(f.order);
          } else if (_this.copyOfLi[i]) {// this.copyOfLi[i + 1].classList.add('marginRight');
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

    return Board;
  }();

  var puzzleNode = document.getElementsByClassName('puzzle')[0];
  var tiles = puzzleNode.getElementsByClassName('tile');
  var board = new Board(tiles);
  window.board = board;
  board.init();
  window.addEventListener('keydown', function (e) {
    // console.log(e.keyCode);
    switch (e.keyCode) {
      case 37:
        // 'left'
        board.moveLeft();
        board.render();
        break;

      case 39:
        // 'right'
        board.moveRight();
        board.render();
        break;

      case 38:
        // 'up'
        board.moveUp();
        board.render();
        break;

      case 40:
        // 'down'
        board.moveDown();
        board.render();
        break;

      default:
        break;
    }
  });
};