import { IPoint, IField } from './main'

class EmptyField implements IField {
  public el: HTMLDivElement
  public id: number
  public position: IPoint


  constructor({ x, y }: IPoint) {
    const el = document.createElement('div');
    el.className = 'tile empty';
    el.setAttribute('unselectable', 'on');
    el.textContent = '';

    this.el = el;
    this.id = 16;
    this.position = {
      x,
      y,
    };
  }
}

export default EmptyField;
