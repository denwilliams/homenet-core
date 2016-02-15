/// <reference path="../../interfaces/interfaces.d.ts" />


/**
 * @classdesc Key value store
 * @class
 * @param {string} id - id of this instance
 * @todo persist key values and load
 */
class ValueStore {

  private _eventBus: IEventBus;
  private _values: Dict<any>;

  id: string;

  constructor(id: string, eventBus: IEventBus) {
    this.id = id;
    this._eventBus = eventBus;
    this._values = {};
  }

  /**
  * Sets a value
  * @param {string} key
  * @param {*} value value
  */
  set(key: string, value: any) {
    this._values[key] = value;
    this._eventBus.emit('value.'+this.id, key, {key:key,value:value});
  }

  /**
  * Gets a value
  * @param  {string} key
  * @return {*}     value
  */
  get(key: string) {
    return this._values[key];
  }


  getAll() : Dict<any> {
    return this._values;
  }
}

export = ValueStore;
