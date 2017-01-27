import {ValueStore} from './value-store';
import {inject, injectable} from 'inversify';
import * as _ from 'lodash';

/**
 * @constructor
 * @example
 * valuesManager.addType('temperature:zway', switchSpec);
 * switchManager.addInstance('loungeroom:lights', 'lights:hue');
 * switchManager.set('loungeroom:lights', true)
 * var lights = switchManager.get('loungeroom:lights');
 */
@injectable()
export class ValuesManager implements Homenet.IValuesManager {
  private _logger: Homenet.ILogger;
  private _eventBus: Homenet.IEventBus;
  private _persistence: Homenet.IPersistence;
  // private _types: any;
  private _instances: Homenet.Dict<ValueStore>

  constructor(
        @inject('IPersistence') persistence: Homenet.IPersistence,
        @inject('IEventBus') eventBus: Homenet.IEventBus,
        @inject('ILogger') logger: Homenet.ILogger) {
    this._logger = logger;
    this._eventBus = eventBus;
    this._persistence = persistence;
    // this._types = {};
    this._instances = {};
  }

  private _getId(typeId: string, instanceId: string) {
    if (!instanceId) return typeId;
    return typeId + '.' + instanceId;
  }

  /**
  * Adds a new instance to the manager
  * @param {string} instanceId - unique ID for this instance
  * @param {Array<string>|string} types - array of switch type IDs to be applied to this instance
  */
  addInstance(typeId: string, instanceId: string) : Homenet.IValueStore {
    var id = this._getId(typeId, instanceId);
    var instance = new ValueStore(id, this._eventBus, this._persistence);
    this._instances[id] = instance;
    return instance;
  }

  /**
  * Gets an instance by it's type and ID
  * @param  {string} typeId
  * @param  {string} instanceId
  * @return {ValueStore}
  */
  getInstance(typeId: string, instanceId: string) {
    const id: string = this._getId(typeId, instanceId);
    return this._instances[id] || null;
  }

  getAllInstances() : Homenet.IValueStore[] {
    return _.values<Homenet.IValueStore>(this._instances);
  }

  getInstances(type: string) : Homenet.IValueStore[] {
    return this.getAllInstances().filter(i => {
      return (i.id.indexOf(type) === 0);
    });
  }

  waitReady(typeId: string, instanceId: string) : Promise<void> {
    const instance = this.getInstance(typeId, instanceId);
    return instance.waitReady();
  }

  /**
  * Sets value
  * @param  {string} instanceId - the ID of the instance to set
  * @param  {string} typeId
  * @param  {string} key - the key
  * @param  {*} value  - the new value
  */
  set(typeId: string, instanceId: string, key: string, value: any) {
    var id = this._getId(typeId, instanceId);
    var instance = this._instances[id];
    if (instance) return instance.set(key, value);
    this._logger.warn('Cannot find values instance ' + id);
  }

  /**
  * Gets value
  * @param  {string} instanceId - the ID of the instance to run a command on
  * @param  {string} typeId
  * @param  {string} key - the key
  * @return {*} the most recent value
  */
  get(typeId: string, instanceId: string, key: string) {
    var id = this._getId(typeId, instanceId);
    return this._instances[id].get(key);
  }
}
