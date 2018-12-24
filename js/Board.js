const _matrix = Symbol('_matrix');
const _table = Symbol('_table');
const _parent = Symbol('_parent');

class Board {
  constructor(parent) {
    // eslint-disable-next-line no-use-before-define
    const { matrix, table } = createTable(4);
    this[_parent] = parent;
    this[_matrix] = matrix;
    this[_table] = table;
  }

  /**
 * Содержит ссылку на таблицу <table></table>
 * в которую апэндяться плитки
 * table.appendChild(tile)
 *
 * @readonly
 * @memberof Board
 */
  get parent() {
    return this[_parent];
  }

  /**
   * Заполняет Board новыми плитками из массива.
   *
   * Плитки класса Tile должны иметь следущие свойства:
   *
   * tile.el - содержит html элемент
   *
   * tile.position.x - 0...3
   *
   * tile.position.y - 0...3
   *
   * @param {Array} tiles
   * @memberof Board
   * @returns true || false
   */
  update(tiles) {
    if (tiles instanceof Array) {
      tiles.forEach((tile) => {
        if (
          typeof tile.position.x !== 'undefined'
          && typeof tile.position.y !== 'undefined'
        ) {
          const { x, y } = tile.position;
          this[_matrix][y][x].innerHTML = '';
          this[_matrix][y][x].appendChild(tile.el);
        } else throw new RangeError('аргумент должен иметь свойства "position.x & position.y"');
      });

      this[_parent].appendChild(this[_table]);
      return true;
    }
    return false;
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
