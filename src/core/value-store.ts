// import {Homenet} from '../interfaces.d.ts';

/**
 * @classdesc Key value store
 * @class
 * @param {string} id - id of this instance
 * @todo persist key values and load
 */
export class ValueStore {

  private _eventBus: Homenet.IEventBus;
  private _persistence: Homenet.IPersistence;
  private _values: Homenet.Dict<any>;
  private _waiting: Function[];

  public id: string;
  public guid: string;

  constructor(id: string, eventBus: Homenet.IEventBus, persistence: Homenet.IPersistence) {
    this.id = id;
    this.guid = 'value.' + id;
    this._eventBus = eventBus;
    this._persistence = persistence;
    this._values = null;
    this._waiting = [];

    persistence.get(this.guid)
    .then(values => {
      this._values = values || {};
      this._waiting.forEach(fn => fn());
    })
    .catch(err => {
      console.error('DEBUG: persistence get error', err);
    });
  }

  waitReady() : Promise<void> {
    if (this._values) {
      return Promise.resolve();
    }
    return new Promise<any>((resolve) => {
      this._waiting.push(resolve);
    });
  }

  /**
  * Sets a value
  * @param {string} key
  * @param {*} value value
  */
  set(key: string, value: any) {
    if (!this._values) throw new Error('Waiting for initialization');
    this._values[key] = value;
    this._eventBus.emit(this.guid, key, value);
    this._persistence.set(this.guid, this._values);
  }

  /**
  * Gets a value
  * @param  {string} key
  * @return {*}     value
  */
  get(key: string) : any {
    return this._values[key];
  }

  getAll() : Homenet.Dict<any> {
    return this._values;
  }
}
