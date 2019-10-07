import Tile from './Tile';

class Board {
  private matrix: any;
  private table: any;
  private _parent: HTMLTableElement;

  constructor(parentTable: HTMLTableElement) {
    const { matrix, table } = createTable(4);
    this._parent = parentTable;
    this.matrix = matrix;
    this.table = table;
  }

  /**
 * Содержит ссылку на таблицу <table></table>
 * в которую апэндяться плитки
 * table.appendChild(tile)
 */
  get parent() {
    return this._parent;
  }

  update(tiles: Tile[]): void {
    tiles.forEach((tile) => {
      const { x, y } = tile.position;
      this.matrix[y][x].innerHTML = '';
      this.matrix[y][x].appendChild(tile.el);
    });

    this._parent.appendChild(this.table);
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
function createTable(sideSize: number = 4) {
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
