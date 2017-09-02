import { EventEmitter } from 'events';

export const AVAILABLE_COMMANDS = {
  'execute': {
    "title": "Execute",
    "comment": "Runs the macro"
  }
};

export class Macro extends EventEmitter implements Homenet.IMacro {
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
    return AVAILABLE_COMMANDS;
  }

  get commandId() {
    return this.id;
  }

  get switchId() {
    return this.id;
  }
}
