import { SwitchEventWrapper } from '../../core/models/switch-event-wrapper';

export class Light implements Homenet.ILight {
  private _switch: Homenet.ISwitch;
  private _eventBus: Homenet.IEventBus;

  constructor(id: string, lightSwitch: Homenet.ILightSwitch, eventBus: Homenet.IEventBus, logger: Homenet.ILogger) {
    this._switch = new SwitchEventWrapper(id, lightSwitch, eventBus, logger);
    this._eventBus = eventBus;
  }

  set(value) {
    return this._switch.set(value);
  }

  get() {
    return this._switch.get();
  }

  on(event: string, handler: Function) {
    return this._switch.on(event, handler);
  }

  removeListener(event: string, handler: Function) {
    return this._switch.removeListener(event, handler);
  }

  turnOn() {
    return this.set(true);
  }

  turnOff() {
    return this.set(false);
  }
}