export const AVAILABLE_COMMANDS = {
  'turnOn': {
    "title": "Turn On",
    "comment": "Turns on the HVAC"
  },
  'turnOff': {
    "title": "Turn Off",
    "comment": "Turns off the HVAC"
  }
};

export class Hvac implements Homenet.IHvac {
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

  get commandMeta() {
    return AVAILABLE_COMMANDS;
  }

  get commandId() {
    return this.id;
  }

  get switchId() {
    return this.id;
  }
}
