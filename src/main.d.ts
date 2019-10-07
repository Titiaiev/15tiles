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

export interface IUI {
  openInfoBtn: HTMLButtonElement;
  closeInfoBtn: HTMLButtonElement;
  currentTime: string;
  currentSteps: string;
  recordTime: string;
  recordSteps: string;
}