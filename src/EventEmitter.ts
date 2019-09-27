class EventEmitter {
  private events: object;

  constructor() {
    this.events = {};
  }

  on(type: string, listener: () => any) {
    this.events[type] = this.events[type] || [];
    this.events[type].push(listener);
  }

  emit(type: string, arg: any) {
    if (this.events[type]) {
      this.events[type].forEach(listener => listener(arg));
    }
  }
}

export default EventEmitter;
