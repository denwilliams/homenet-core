export const AVAILABLE_COMMANDS = {
  'turnOn': {
    "title": "Turn On",
    "comment": "Turns on the Power"
  },
  'turnOff': {
    "title": "Turn Off",
    "comment": "Turns off the Power"
  }
};

export class Power implements Homenet.IPower {
  public expose: boolean;
  public name: string;

  constructor(public id: string, private settable: Homenet.ISettable, opts : any) {
    this.expose = opts.expose || false;
    this.name = opts.name || id;
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

  get commandId(): string {
    return 'power.' + this.id;
  }

  get switchId(): string {
    return 'power.' + this.id;
  }
}
