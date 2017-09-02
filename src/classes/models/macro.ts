export const AVAILABLE_COMMANDS = {
  'execute': {
    "title": "Execute",
    "comment": "Runs the macro"
  }
};

export class Macro implements Homenet.IMacro {
  constructor(public id: string, private eventBus: Homenet.IEventBus, private logger: Homenet.ILogger) {
  }

  execute() {
    this.logger.info(`Running macro ${this.id}`);
    this.eventBus.emit(`macro.${this.id}`, 'executed', { timestamp: new Date() });
  }

  get commandMeta() {
    return AVAILABLE_COMMANDS;
  }

  get commandId() {
    return this.id;
  }
}
