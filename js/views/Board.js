class Board {
  constructor(parent) {
    // eslint-disable-next-line no-use-before-define
    const { matrix, table } = createTable(4);
    this._matrix = matrix;
    this._table = table;
    parent.parentNode.replaceChild(table, parent);
  }

  update = (tiles) => {
    if (tiles instanceof Array) {
      tiles.forEach((tile) => {
        if (
          typeof tile.position.x !== 'undefined'
          && typeof tile.position.y !== 'undefined'
        ) {
          const { x, y } = tile.position;
          this._matrix[y][x].innerHTML = '';
          this._matrix[y][x].appendChild(tile.el);
        } else throw new RangeError('аргумент должен иметь свойства "position.x & position.y"');
      });

      return true;
    }
    return false;
  }

  animateWin() {
    this._table.classList.add('win');
  }
}

/**
 * Сгенерировать квадратную html таблицу без обертки <table></table>
 *
 * @param {number} [sideSize=4] размер стороны квадратной таблицы
 * @returns объект со свойствами matrix, table
 *
 * table - DocumentFragment содержит табличные строки и ячейки, апэндится в таблицу <table></table>
 *
 * matrix - удобная структура (двумерный массив) хранящая ссылки на ячейки <td> в строках <tr>
 */
function createTable(sideSize = 4) {
  const matrix = [];
  const table = document.createElement('table');
  table.classList.add('board');

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
