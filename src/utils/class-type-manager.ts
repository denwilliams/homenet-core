/// <reference path="../interfaces.d.ts"/>

import {lazySingleton, eagerSingleton} from './lifecycle';
import chalk = require('chalk');
// import {Homenet} from '../interfaces.d.ts';

/**
  * Manages instances of a specific class
  * @class
  * @param {string} classId
  * @param {ClassTypeManager.onAddInstance} onAddInstance
  * @param {Logger} logger
  */
abstract class ClassTypeManager<T> implements Homenet.IClassTypeManager<T> {

  protected _logger: Homenet.ILogger;
  private _addInstance: Homenet.IClassFactory<T>;

  classId: string;
  instances: Homenet.Dict<Homenet.Func<T>>;
  types: Homenet.Dict<Homenet.IClassTypeFactory<T>>;

  constructor(classId: string, logger: Homenet.ILogger) {
    const self = this;

    if (!classId) throw new Error('classId cannot be null');
    if (!logger) throw new Error('logger cannot be null');

    const instances: Homenet.Dict<Homenet.Func<T>> = {};
    const types: Homenet.Dict<any> = {};

    this.classId = classId;
    this.types = types;
    this.instances = instances;

    this._logger = logger;
    this._addInstance = addInstance;

    logger.info('Starting '+classId+' manager');

    function addInstance(instanceId: string, typeId: string, opts: any) : T|Homenet.Func<T> {
      logger.debug('Creating ' + chalk.cyan(classId) + ' with ID ' + chalk.green(instanceId) + ' of type ' + chalk.cyan(typeId));
      var instance: Homenet.Func<T> = eagerSingleton(createInstance, [typeId, instanceId, opts], null);
      instances[instanceId] = instance;
      self.onAddInstance(instance, instanceId, typeId, opts);
      return instance;
    }

    function createInstance(typeId: string, instanceId: string, opts: any) : T {
      logger.info('Creating ' + chalk.cyan(classId) + ' instance of type ' + chalk.cyan(typeId) + ' with ID ' + chalk.green(instanceId));
      var typeFactory: Homenet.IClassTypeFactory<T> = types[typeId];
      return typeFactory(instanceId, opts);
    }
  }

  /**
   * Adds this type manager instance to the classes module
   * @param {ClassesManager} classes - classes module
   */
  addToClasses(classes: Homenet.IClassesManager) {
    classes.addClass(this.classId, this._addInstance);
  }

  /**
   * Adds a new light type
   * @param {string} typeId  - ID of the type
   * @param {function} factory -
   */
  addType(typeId: string, factory: Homenet.IClassTypeFactory<T>) {
    this._logger.info('Adding '+this.classId+' type ' + typeId);
    this.types[typeId] = factory;
  }

  /**
   * [getInstance description]
   * @param  {string} instanceId
   * @return {*} the instance
   */
  getInstance(instanceId: string) : T {
    var singletonProvider: Homenet.Func<T> = this.instances[instanceId];
    if (singletonProvider) return singletonProvider();
    this._logger.warn('Cannot find instance ' + instanceId);
    return null;
  }

  /**
   * Gets all added instances
   * @return {Object<string,*>} an array of instances
   * @todo call factory methods
   */
  getAllInstances(): Homenet.Dict<Homenet.Func<T>> {
    return this.instances;
  }

  /**
    * Called after an instance has been added by a class type manager.
    * @callback ClassTypeManager.onAddInstance
    * @param {*} instance
    * @param {string} instanceId
    * @param {string} typeId
    * @param {Object} opts
    */
  protected abstract onAddInstance(instance: Homenet.Func<T>, instanceId: string, typeId: string, opts: any): void;


}

export = ClassTypeManager;
