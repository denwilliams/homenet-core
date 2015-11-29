/// <reference path="../../interfaces/interfaces.d.ts" />

import consts = require('./consts.ts');
//const EVENT_PREFIX: string = consts.EVENT_PREFIX + '.';
const EVENT_PREFIX: string = 'switch.';


class SwitchWrapper implements Switch {
  
  id: string;
  emitOnSet: boolean;
  
  private _logger : Logger;
  private _eventBus: EventBus;
  private _instance: SwitchInstanceProvider;
  
  constructor(id: string, instanceProvider: SwitchInstanceProvider, eventBus: EventBus, logger: Logger) {
    this._logger = logger;
    this._eventBus = eventBus;
    
    logger.debug('Creating a new SwitchWrapper: ' + id);
    this.id = id;
    this._instance = instanceProvider;
  }

  set(value) : any {
    var instance : any = this._instance();
    this._logger.info('Setting switch ' + this.id + ' : ' + value);
    var result = instance.set.apply(instance, arguments);
    this._eventBus.emit(EVENT_PREFIX+this.id, null, value);
    return result;
  };

  get() : any {
    var instance = this._instance();
    this._logger.debug('Getting switch ' + this.id);
    var result = instance.get.apply(instance, arguments);
    return result;
  };
}

export = SwitchWrapper;