import { EventEmitter } from 'events';

export const AVAILABLE_COMMANDS = {
  'execute': {
    "title": "Execute",
    "comment": "Runs the macro"
  }
};

export const AVAILABLE_SWITCH_COMMANDS = {
  'turnOn': {
      "title": "Turn On",
      "comment": "Turns on the macro switch"
  },
  'turnOff': {
      "title": "Turn Off",
      "comment": "Turns off the macro switch"
  }
};

export class Macro extends EventEmitter implements Homenet.IMacro {
  private lastValue: boolean = false;
  private expose: boolean = false;
  private name: string;

  constructor(public id: string, private eventBus: Homenet.IEventBus, private logger: Homenet.ILogger, private options: any) {
    super();
    this.expose = options.any || false;
    this.name = options.name || id;
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

  execute() {
    this.logger.info(`Running macro ${this.id}`);
    this.eventBus.emit(`macro.${this.id}`, 'executed', { timestamp: new Date() });
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
    if (this.options.switch) {
      return AVAILABLE_SWITCH_COMMANDS;
    }
    return AVAILABLE_COMMANDS;
  }

  get commandId() {
    return this.id;
  }

  get switchId() {
    if (this.options.switch) {
      return this.id;
    }
  }
}
