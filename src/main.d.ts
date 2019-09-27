export interface IPoint {
  x: number;
  y: number;
}

export interface IPositionGenerator {
  next(): IPoint
}

export interface IField {
  el: HTMLDivElement;
  id: number;
  position: IPoint;
}