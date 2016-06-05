const EVENT_TYPE: string = 'switch';

import chalk = require('chalk');
import _ = require('lodash');
import SwitchWrapper = require('./models/wrapper');
import {inject, injectable} from 'inversify';
// import {Homenet} from '../interfaces.d.ts';

/**
 * @constructor
 * @example
 * switchManager.addType('lights:hue', switchSpec);
 * switchManager.addInstance('loungeroom:lights', 'lights:hue');
 * switchManager.set('loungeroom:lights', true)
 * var lights = switchManager.get('loungeroom:lights');
 */
@injectable()
class SwitchManager implements Homenet.ISwitchManager {

  types: Homenet.Dict<Homenet.ISwitchFactory>
  instances: Homenet.Dict<Homenet.ISwitch>
  categories: Homenet.Dict<any>

  private _logger: Homenet.ILogger;
  private _eventBus: Homenet.IEventBus;

  constructor(
        @inject('IEventBus') eventBus: Homenet.IEventBus,
        @inject('ILogger') logger: Homenet.ILogger) {
    this._logger = logger;
    this._eventBus = eventBus;

    this.types = {};
    this.instances = {};
    this.categories = {};
  }

  _wrap(id: string, instance: Homenet.ISwitchInstanceProvider) : SwitchWrapper {
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
  addType(typeId: string, switchFactory: Homenet.ISwitchFactory): void {
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
    this._logger.debug('Adding switch ' + chalk.green(instanceId) + ' of type ' + chalk.cyan(typeId));
    this.instances[id] = this._createInterfaceWrapper(typeId, instanceId, opts);
  };

  /**
  * Gets all instances
  */
  getAllInstances(): Homenet.Dict<Homenet.ISwitch> {
    return this.instances;
  };

  /**
  * Gets switch instance
  * @returns {SwitchWrapper}
  */
  getInstance(typeId: string, instanceId: string): Homenet.ISwitch {
    var id = getId(typeId, instanceId);
    var switchWrapper = this.instances[id];
    if (switchWrapper) return switchWrapper;
    this._logger.warn(chalk.red('No instance found') + ' for switch: ' + chalk.green(id));
    return null;
  };

  /**
  * Sets switch state
  * @param  {string} instanceId - the ID of the instance to set
  * @param  {*} value  - the new value
  */
  set(typeId: string, instanceId: string, value: boolean|string|number): any {
    var instance: Homenet.ISwitch = this.getInstance(typeId, instanceId);
    var result = instance.set(value);
    // if (instance.emitOnSet) {
    //   this.emitValue(typeId, instanceId, value);
    // }
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

  // emitValue(typeId: string, instanceId: string, value: boolean|string|number) {
  //   var instance: ISwitch = this.getInstance(typeId, instanceId);
  //   if (!instance) {
  //     this._logger.warn('');
  //     return;
  //   }
  //   return instance.emitValue(value);
  // };


  _getType(typeId: string): Homenet.ISwitchFactory {
    return this.types[typeId];
  };

  _createInterfaceWrapper(typeId: string, id: string, opts: any) : SwitchWrapper {
    var factory: Homenet.ISwitchFactory = this._getType(typeId);
    var lazyInstance: Homenet.ISwitchInstanceProvider = lazy(factory, id, opts);
    var wrapper = this._wrap(getId(typeId, id), lazyInstance);
    // todo: add to categories based on type
    return wrapper;
  };
}

function getId(typeId: string, instanceId: string) : any {
  if (instanceId) return typeId+'.'+instanceId;
  return typeId;
}

function lazy(factory: Homenet.ISwitchFactory, id: string, opts: any): Homenet.ISwitchInstanceProvider {
  var instance: Homenet.ISwitch;
  return function() {
    if (!instance) instance = factory(opts);
    return instance;
  };
}

export = SwitchManager;
