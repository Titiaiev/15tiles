const _game = Symbol('_game');

class Tile {
  constructor(id, { x, y }, game) {
    const el = document.createElement('div');
    el.classList.add('tile');
    el.setAttribute('unselectable', 'on');
    el.textContent = id;

    // eslint-disable-next-line no-use-before-define
    el.addEventListener('click', clickOrTouchHandle.bind(this), false);
    // eslint-disable-next-line no-use-before-define
    el.addEventListener('touchend', clickOrTouchHandle.bind(this), false);

    this[_game] = game;
    this.el = el;
    this.id = id;
    this.position = {
      x,
      y,
    };
  }
}

function clickOrTouchHandle(e) {
  const { empty, move } = this[_game];

  e.stopPropagation();
  e.preventDefault();
  const deltaX = this.position.x - empty.position.x;
  const deltaY = this.position.y - empty.position.y;
  // console.log(`x === ${deltaX} && y === ${deltaY}`);
  if (deltaX === -1 && deltaY === 0) move.call(this[_game], 'right');
  else if (deltaX === 1 && deltaY === 0) move.call(this[_game], 'left');
  else if (deltaX === 0 && deltaY === -1) move.call(this[_game], 'down');
  else if (deltaX === 0 && deltaY === 1) move.call(this[_game], 'up');
  // console.log(e);
}

export default Tile;
