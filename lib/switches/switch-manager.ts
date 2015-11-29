/// <reference path="../../typings/lodash/lodash.d.ts" />

/// <reference path="../../interfaces/interfaces.d.ts" />


import _ = require('lodash');
import consts = require('./consts.ts');
import SwitchWrapper = require('./wrapper.ts');

/**
 * @constructor
 * @example
 * switchManager.addType('lights:hue', switchSpec);
 * switchManager.addInstance('loungeroom:lights', 'lights:hue');
 * switchManager.set('loungeroom:lights', true)
 * var lights = switchManager.get('loungeroom:lights');
 */
class SwitchManagerImpl implements SwitchManager {
  
  types: Dict<SwitchFactory>
  instances: Dict<Switch>
  categories: Dict<any>
  
  private _logger: Logger;
  private _eventBus: EventBus;
  
  
  constructor(eventBus: EventBus, logger: Logger) {
    this._logger = logger;
    this._eventBus = eventBus;
    this.types = {};
    this.instances = {};
    this.categories = {};
  }
  
  _wrap(id: string, instance: SwitchInstanceProvider) : SwitchWrapper {
    return new SwitchWrapper(id, instance, this._eventBus, this._logger);
  }
  
  /**
  * This callback is displayed as part of the Requester class.
  * @callback SwitchManager~switchFactory
  * @param {*} options
  * @returns {Switch}
  */
  
  /**
  * @interface Switch
  */
  /**
  * set switch state
  * @method Switch#set
  */
  /**
  * get switch state
  * @method Switch#get
  */
  /**
  * If true then an event will be emitted after #set is called.
  * If false then the implementation will need to manually call `emitValue` after set.
  * @member {boolean} Switch#emitOnSet
  */
  /**
  * @member {string} category - category this switch will be listed in
  */
  
  /**
  * Adds a switch type.
  * @param {string} typeId - identifier for the type
  * @param {SwitchManager~switchFactory} switchFactory - get and set implementations, and optional categories
  */
  addType(typeId: string, switchFactory: SwitchFactory): void {
    this._logger.info('Adding switch type ' + typeId);
    this.types[typeId] = switchFactory;
  };
  
  /**
  * Adds a new instance to the manager
  * @param {string} instanceId - unique ID for this instance
  * @param {string} typeId - type ID to be applied to this instance
  */
  addInstance(typeId: string, instanceId: string, opts: any): void {
    var id: string = getId(typeId, instanceId);
    this._logger.debug('Adding switch ' + instanceId + ' of type ' + typeId);
    this.instances[id] = this._createInterfaceWrapper(typeId, instanceId, opts);
  };
  
  /**
  * Gets all instances
  */
  getAllInstances(): Dict<Switch> {
    return this.instances;
  };
  
  /**
  * Gets switch instance
  * @returns {SwitchWrapper}
  */
  getInstance(typeId: string, instanceId: string): Switch {
    var id = getId(typeId, instanceId);
    var switchWrapper = this.instances[id];
    if (switchWrapper) return switchWrapper;
    this._logger.warn('No instance found for switch: ' + id);
    return null;
  };
  
  /**
  * Sets switch state
  * @param  {string} instanceId - the ID of the instance to set
  * @param  {*} value  - the new value
  */
  set(typeId: string, instanceId: string, value: boolean|string|number): any {
    var instance: Switch = this.getInstance(typeId, instanceId);
    var result = instance.set(value);
    if (instance.emitOnSet) {
      this.emitValue(typeId, instanceId, value);
    }
    return result;
  };
  
  /**
  * Gets switch state
  * @param  {string} instanceId - the ID of the instance to run a command on
  * @return {*} the most recent value
  */
  get(typeId: string, instanceId: string): boolean|string|number {
    var instance = this.getInstance(typeId, instanceId);
    return instance.get();
  };
  
  emitValue(typeId: string, instanceId: string, value: boolean|string|number) {
    var instance: Switch = this.getInstance(typeId, instanceId);
    return instance.emitValue(value);
  };
  
  
  _getType(typeId: string): SwitchFactory {
    return this.types[typeId];
  };
  
  _createInterfaceWrapper(typeId: string, id: string, opts: any) : SwitchWrapper {
    var factory: SwitchFactory = this._getType(typeId);
    var lazyInstance: SwitchInstanceProvider = lazy(factory, id, opts);
    var wrapper = this._wrap(getId(typeId, id), lazyInstance);
    // todo: add to categories based on type
    return wrapper;
  };
}

function getId(typeId: string, instanceId: string) : any {
  if (instanceId) return typeId+'.'+instanceId;
  return typeId;
}

function lazy(factory: SwitchFactory, id: string, opts: any): SwitchInstanceProvider {
  var instance: Switch;
  return function() {
    if (!instance) instance = factory(opts);
    return instance;
  };
}

export = SwitchManagerImpl;
