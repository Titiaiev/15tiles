class Tile {
  constructor(id, { x, y }) {
    const el = document.createElement('div');
    el.classList.add('tile');
    el.setAttribute('unselectable', 'on');
    el.textContent = id;
    // eslint-disable-next-line func-names
    el.onclick = function (e) {
      console.log(e.target);
    };

    this.id = id;
    this.el = el;
    this.position = {
      x,
      y,
    };
  }
}

export default Tile;
