class Tile {
  constructor(size) {
    this.order = Tile.getUniqRandom(size);
  }

  static getUniqRandom(max) {
    const random = _max => Math.floor(1 + Math.random() * (_max));
    let i = random(max);
    if (this.randomCache.length < (max)) {
      while (this.randomCache.includes(i)) {
        i = random(max);
      }
      this.randomCache.push(i);

      // console.log(this.randomCache);
      return i;
    }
    this.randomCache = [];
    return null;
  }
}
Tile.randomCache = [];

export default Tile;
