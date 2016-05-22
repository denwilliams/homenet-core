const EVENT_TYPE: string = 'switch';
const EVENT_PREFIX: string = EVENT_TYPE+'.';
import {EventEmitter} from 'events';

class SwitchWrapper extends EventEmitter implements ISwitch {

  id: string;
  emitOnSet: boolean;

  private _logger : ILogger;
  private _eventBus: IEventBus;
  private _instance: ISwitchInstanceProvider;

  constructor(id: string, instanceProvider: ISwitchInstanceProvider, eventBus: IEventBus, logger: ILogger) {
    super();

    this._logger = logger;
    this._eventBus = eventBus;

    logger.debug('Creating a new SwitchWrapper: ' + id);
    this.id = id;
    this._instance = instanceProvider;
  }

  private load() {
    this._getInstance().on('updated', this.emitValue.bind(this));
  }

  private _getInstance() : ISwitch {
    return this._instance();
  }

  set(value) : any {
    var instance : ISwitch = this._getInstance();
    this._logger.info('Setting switch ' + this.id + ' : ' + value);
    var result = instance.set.apply(instance, arguments);
    this.emitValue(value);
    return result;
  };

  get() : any {
    var instance = this._instance();
    this._logger.debug('Getting switch ' + this.id);
    var result = instance.get.apply(instance, arguments);
    return result;
  };

  emitValue(value: boolean|string|number) : void {
    this._eventBus.emit(EVENT_PREFIX+this.id, null, value);
    this.emit('updated', value);
  }
}

export = SwitchWrapper;
