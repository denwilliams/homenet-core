const EVENT_TYPE: string = 'switch';

import chalk = require('chalk');
import _ = require('lodash');
// import { SwitchWrapper } from './models/switch-wrapper';
import { inject, injectable } from 'inversify';
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
export class SwitchManager implements Homenet.ISwitchManager {
  private _instances: Homenet.Dict<Homenet.ISwitch>
  private _logger: Homenet.ILogger;

  constructor(
        @inject('ILogger') logger: Homenet.ILogger) {
    this._logger = logger;
    this._instances = {};
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
  * Adds a new instance to the manager
  * @param {string} instanceId - unique ID for this instance
  * @param {string} typeId - type ID to be applied to this instance
  */
  // addInstance(typeId: string, instanceId: string, opts: any): void {
  addInstance(id: string, sw: Homenet.ISwitch): void {
    // var id: string = getId(typeId, instanceId);
    this._logger.debug('Adding switch ' + chalk.green(id));
    this._instances[id] = sw;
  };

  /**
  * Gets all instances
  */
  getAllInstances(): Homenet.Dict<Homenet.ISwitch> {
    return this._instances;
  };

  /**
  * Gets switch instance
  * @returns {SwitchWrapper}
  */
  getInstance(id: string): Homenet.ISwitch {
    return this._instances[id] || null;
  };

  /**
  * Sets switch state
  * @param  {string} instanceId - the ID of the instance to set
  * @param  {*} value  - the new value
  */
  set(id: string, value: boolean|string|number): any {
    const instance: Homenet.ISwitch = this.getInstance(id);
    if (!instance) throw new Error(`No instance found for ${id}`)
    return instance.set(value);
  };

  /**
  * Gets switch state
  * @param  {string} instanceId - the ID of the instance to run a command on
  * @return {*} the most recent value
  */
  get(id: string): boolean|string|number {
    const instance = this.getInstance(id);
    if (!instance) throw new Error(`No instance found for ${id}`)
    return instance.get();
  };
}
