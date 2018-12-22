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

export default PositionGenerator;
