const EVENT_TYPE: string = 'switch';
const EVENT_PREFIX: string = `${EVENT_TYPE}.`;

/**
 * Relays `update` events to the event bus.
 */
export class SwitchEventWrapper implements Homenet.ISwitch {
  private guid;

  constructor(public id: string, private instance: Homenet.ISettable, private eventBus: Homenet.IEventBus, private logger: Homenet.ILogger) {
    this.guid = `${EVENT_PREFIX}${this.id}`;
    logger.debug(`Creating a new SwitchEventWrapper: ${id}`);
    instance.on('update', value => this.emitUpdateToEventBus(value));
  }

  set(value) : any {
    this.logger.info(`Setting switch ${this.id} : ${value}`);
    return this.instance.set.apply(this.instance, arguments);
  };

  get() : any {
    this.logger.debug(`Getting switch ${this.id}`);
    return this.instance.get.apply(this.instance, arguments);
  };

  on(event: 'update', handler: (value: any) => void) {
    return this.instance.on(event, handler);
  }

  removeListener(event: 'update', handler: (value: any) => void) {
    return this.instance.removeListener(event, handler);
  }

  private emitUpdateToEventBus(value: boolean|string|number) : void {
    this.eventBus.emit(`${this.guid}`, 'update', value);
  }
}
