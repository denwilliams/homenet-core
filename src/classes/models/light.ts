export class Light implements Homenet.ILight {
  constructor(public id: string, private settable: Homenet.ISettable) {
  }

  set(value) {
    return this.settable.set(value);
  }

  get() {
    return this.settable.get();
  }

  on(event: 'update', handler: (value: any) => void) {
    return this.settable.on(event, handler);
  }

  removeListener(event: 'update', handler: (value: any) => void) {
    return this.settable.removeListener(event, handler);
  }

  turnOn() {
    return this.set(true);
  }

  turnOff() {
    return this.set(false);
  }
}