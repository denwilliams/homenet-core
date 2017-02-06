export const AVAILABLE_COMMANDS = {
  'lock': {
    "title": "Lock",
    "comment": "Lock the device"
  },
  'unlock': {
    "title": "Unlock",
    "comment": "Unlock the device"
  }
};

export class Lock implements Homenet.ILock {
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

  lock() {
    return this.set(true);
  }

  unlock() {
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

  // get valueId() {
  //   return this.id;
  // }
}