const EVENT_TYPE: string = 'switch';
const EVENT_PREFIX: string = `${EVENT_TYPE}.`;
import {EventEmitter} from 'events';

export class SwitchEventWrapper extends EventEmitter implements Homenet.ISwitch {
  id: string;

  private _logger : Homenet.ILogger;
  private _eventBus: Homenet.IEventBus;
  private _instance: Homenet.ISettable;

  constructor(id: string, instance: Homenet.ISettable, eventBus: Homenet.IEventBus, logger: Homenet.ILogger) {
    super();

    this.id = id;
    this._logger = logger;
    this._eventBus = eventBus;
    this._instance = instance;

    logger.debug(`Creating a new SwitchEventWrapper: ${id}`);
  }

  set(value) : any {
    this._logger.info(`Setting switch ${this.id} : ${value}`);
    const instance = this._instance;
    const result = instance.set.apply(instance, arguments);
    this.emitValue(value);
    return result;
  };

  get() : any {
    this._logger.debug(`Getting switch ${this.id}`);
    const instance = this._instance;
    const result = instance.get.apply(instance, arguments);
    return result;
  };

  emitValue(value: boolean|string|number) : void {
    this.emit('updated', value);
    this._eventBus.emit(`${EVENT_PREFIX}${this.id}`, null, value);
  }
}
