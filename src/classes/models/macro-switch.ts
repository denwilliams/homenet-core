import { EventEmitter } from 'events';

export const AVAILABLE_COMMANDS = {
  'turnOn': {
    "title": "Turn on",
    "comment": "Turns the device etc on via a macro"
  },
  'turnOff': {
    "title": "Turn off",
    "comment": "Turns the device etc off via a macro"
  }
};

export class MacroSwitch extends EventEmitter implements Homenet.IMacroSwitch {
  private lastValue: boolean = false;

  constructor(public id: string, private eventBus: Homenet.IEventBus, private logger: Homenet.ILogger) {
    super();
  }

  set(boolValue: boolean) {
    this.lastValue = boolValue;
    const response = boolValue
      ? this.turnOn()
      : this.turnOff();

    this.emit('update', boolValue);

    return response;
  }

  get() {
    return this.lastValue;
  }

  turnOn() {
    this.logger.info(`Running on macro ${this.id}`);
    this.eventBus.emit(`macro.${this.id}`, 'on', { timestamp: new Date() });
  }

  turnOff() {
    this.logger.info(`Running off macro ${this.id}`);
    this.eventBus.emit(`macro.${this.id}`, 'off', { timestamp: new Date() });
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
