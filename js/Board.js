class Board {
  constructor(parent) {
    // eslint-disable-next-line no-use-before-define
    const { matrix, table } = createTable(4);
    this.parent = parent;
    this.matrix = matrix;
    this.table = table;
  }

  update(tiles) {
    if (tiles instanceof Array) {
      tiles.forEach((tile) => {
        if (
          typeof tile.position.x !== 'undefined'
          && typeof tile.position.y !== 'undefined'
        ) {
          const { x, y } = tile.position;
          this.matrix[y][x].innerHTML = '';
          this.matrix[y][x].appendChild(tile.el);
        } else throw new RangeError('аргумент должен иметь свойства "position.x & position.y"');
      });

      this.parent.appendChild(this.table);
    }
  }
}

function createTable(sideSize = 4) {
  const matrix = [];
  const table = document.createDocumentFragment();

  for (let i = 0; i < sideSize; i += 1) {
    const row = document.createElement('tr');
    matrix[i] = row;
    table.appendChild(row);

    for (let j = 0; j < sideSize; j += 1) {
      const col = document.createElement('td');
      matrix[i][j] = col;
      row.appendChild(col);
    }
  }

  return {
    matrix,
    table,
  };
}

export default Board;
