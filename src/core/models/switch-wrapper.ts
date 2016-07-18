const EVENT_TYPE: string = 'switch';
const EVENT_PREFIX: string = EVENT_TYPE+'.';
import {EventEmitter} from 'events';
// import {Homenet} from '../../interfaces.d.ts';

export class SwitchWrapper extends EventEmitter implements Homenet.ISwitch {

  id: string;
  emitOnSet: boolean;

  private _logger : Homenet.ILogger;
  private _eventBus: Homenet.IEventBus;
  private _instance: Homenet.ISwitchInstanceProvider;

  constructor(id: string, instanceProvider: Homenet.ISwitchInstanceProvider, eventBus: Homenet.IEventBus, logger: Homenet.ILogger) {
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

  private _getInstance() : Homenet.ISwitch {
    return this._instance();
  }

  set(value) : any {
    var instance : Homenet.ISwitch = this._getInstance();
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
