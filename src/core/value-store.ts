// import {Homenet} from '../interfaces.d.ts';

/**
 * @classdesc Key value store
 * @class
 * @param {string} id - id of this instance
 * @todo persist key values and load
 */
class ValueStore {

  private _eventBus: Homenet.IEventBus;
  private _values: Homenet.Dict<any>;

  id: string;

  constructor(id: string, eventBus: Homenet.IEventBus) {
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


  getAll() : Homenet.Dict<any> {
    return this._values;
  }
}

export = ValueStore;
