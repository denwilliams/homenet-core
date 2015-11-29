
import ValueStore = require('./value-store');

/**
 * @constructor
 * @example
 * valuesManager.addType('temperature:zway', switchSpec);
 * switchManager.addInstance('loungeroom:lights', 'lights:hue');
 * switchManager.set('loungeroom:lights', true)
 * var lights = switchManager.get('loungeroom:lights');
 */
class ValuesManager {
  
  private _logger: Logger;
  private _eventBus: EventBus;
  // private _types: any;
  private _instances: Dict<ValueStore>
  
  constructor(eventBus: EventBus, logger: Logger) {
    this._logger = logger;
    this._eventBus = eventBus;
    // this._types = {};
    this._instances = {};
  }

  private _getId(typeId: string, instanceId: string) {
    return typeId+'.'+instanceId;
  }
  
  /**
  * Adds a new instance to the manager
  * @param {string} instanceId - unique ID for this instance
  * @param {Array<string>|string} types - array of switch type IDs to be applied to this instance
  */
  addInstance(typeId: string, instanceId: string) {
    var id = this._getId(typeId, instanceId);
    var instance = this._instances[id] = new ValueStore(id, this._eventBus);
    return instance;
  }
  
  /**
  * Gets an instance by it's type and ID
  * @param  {string} typeId     
  * @param  {string} instanceId 
  * @return {ValueStore}
  */
  getInstance(typeId: string, instanceId: string) {
    var id = this._getId(typeId, instanceId);
    var instance = this._instances[instanceId];
    return instance;
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

export = ValuesManager;
