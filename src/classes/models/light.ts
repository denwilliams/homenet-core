import { SwitchEventWrapper } from '../../core/models/switch-event-wrapper';

export class Light implements Homenet.ILight {
  private switch: Homenet.ISwitch;

  constructor(id: string, lightSwitch: Homenet.ISettable, private eventBus: Homenet.IEventBus, private logger: Homenet.ILogger) {
    this.switch = new SwitchEventWrapper(id, lightSwitch, eventBus, logger);
  }

  set(value) {
    return this.switch.set(value);
  }

  get() {
    return this.switch.get();
  }

  on(event: 'update', handler: (value: any) => void) {
    return this.switch.on(event, handler);
  }

  removeListener(event: 'update', handler: (value: any) => void) {
    return this.switch.removeListener(event, handler);
  }

  turnOn() {
    return this.set(true);
  }

  turnOff() {
    return this.set(false);
  }
}