/* eslint-disable import/extensions */
import EventEmitter from '../libs/EventEmitter.js';

class Board extends EventEmitter {
  constructor(model, view) {
    super();
    this.model = model;
    this.view = view;

    this.model
      .on('started', () => this.emit('new-game', null))
      .on('updated', this.view.update)
      .on('updated', () => this.emit('step', null))
      .on('completed', this.win);

    this.view.update(this.model.fields);
  }

  move(direction) {
    this.model.move(direction);
  }

  shuffle = () => {
    this.model.shuffle();
    this.emit('reboot-game', null);
    this.emit('new-game', null);
  }

  trigger(trigger) {
    switch (trigger) {
      case 37: // 'left'
        this.move('left');
        break;
      case 39: // 'right'
        this.move('right');
        break;
      case 38: // 'up'
        this.move('up');
        break;
      case 40: // 'down'
        this.move('down');
        break;
      default:
        break;
    }
  }

  win = () => {
    console.log('Головоломка сложена! Поздравляю!');
    this.view.animateWin();
    this.emit('finish-game');
  }
}

export default Board;
