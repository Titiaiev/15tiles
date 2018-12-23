class Tile {
  constructor(id, { x, y }) {
    const screen = {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      getMinSide() {
        return Math.min(this.height, this.width);
      },
    };

    const tileSize = screen.getMinSide() / 5;

    const el = document.createElement('div');
    el.classList.add('tile');
    el.setAttribute('unselectable', 'on');
    el.textContent = id;
    el.style.width = `${tileSize}px`;
    el.style.height = `${tileSize}px`;
    el.style.fontSize = `${tileSize / 3}px`;

    el.addEventListener('click', clickOrTouchHandle.bind(this), false);
    el.addEventListener('touchend', clickOrTouchHandle.bind(this), false);

    this.el = el;
    this.id = id;
    this.position = {
      x,
      y,
    };
  }
}

function clickOrTouchHandle(e) {
  e.stopPropagation();
  e.preventDefault();
  const _x = this.position.x - game.empty.position.x;
  const _y = this.position.y - game.empty.position.y;
  // console.log(`x === ${_x} && y === ${_y}`);
  if (_x === -1 && _y === 0) game.move('right');
  else if (_x === 1 && _y === 0) game.move('left');
  else if (_x === 0 && _y === -1) game.move('down');
  else if (_x === 0 && _y === 1) game.move('up');
  // console.log(e);
}

export default Tile;
