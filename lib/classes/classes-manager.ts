/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/lodash/lodash.d.ts" />

/// <reference path="../../interfaces/interfaces.d.ts" />

import _  = require('lodash');

/**
 * Container for managing/holding class contructors/factories and class instances
 * @class ClassesManager
 * @param {Logger} logger - logger instance
 */
class ClassesManagerImpl implements ClassesManager {
  
  private _classes : Dict<ClassFactory<any>>;
  private _logger : Logger;
  private _instances : InstancesDict<any>;
  
  constructor(logger : Logger) {
    this._classes = {};
    this._instances = {};
    this._logger = logger;
  }  
    
  /**
   * Adds a new class and a factory to instantiate instances of that class
   * @param {string} classId - unique ID of a class
   * @param {ClassesManager.classFactory} classFactory - factory for creating instances
   */
  addClass<T>(classId: string, classFactory: ClassFactory<T>) : void {
    this._logger.info('Adding class ' + classId);
    this._classes[classId] = classFactory;
  };
  
  /**
   * Add a new instance of a class
   * @param {string} classId    
   * @param {string} instanceId 
   * @param {string} typeId     
   * @param {*} opts
   */
  addInstance<T>(classId: string, instanceId: string, typeId: string, opts: any) : void {
    var factory : ClassFactory<T> = this._classes[classId];
    this._logger.debug('Adding instance of class ' + classId + ' with ID ' + instanceId);
    var id: string = classId + '.' + instanceId;
    this._instances[id] = factory(instanceId, typeId, opts);
  }
  
  /**
   * Gets an existing instance
   * @param {string} classId    
   * @param {string} instanceId 
   * @return {*} class instance
   */
  getInstance<T>(classId: string, instanceId: InstanceOrFactory<T>) {
    var id: string = classId + '.' + instanceId;
    var instance = this._instances[id];
    if (!instance) {
      this._logger.warn('No instance with ID ' + id);
    }
    if (typeof instance === 'function') return (<() => T>instance)();
    return instance;
  }
  
  /**
   * Initializes all class instances.
   * If the instance is a factory it will be created.
   * If the instance has a `.initialize()` method it will be called.
   */
  initializeAll() {
    var self = this;
    self._logger.info('Initializing all class instances...');
    _.each(self._instances, function(factory, key) {
      self._logger.info('Initializing ' + key);
      var instance : any = (typeof factory === 'function') ? (<InstanceOrFactory<any>>factory)() : factory;
      //if (typeof instance.initialize === 'function') instance.initialize();
    });
    this._logger.info('Done initializing');
  }

}

/**
 * Creates a new instance of a class
 * @callback classFactory
 * @memberOf ClassesManager
 * @param {string} instanceId - unique ID for this instance
 * @param {string} [typeId] - type ID that represents a variant of the class. Only passed if this class defines multiple types.
 * @param {*} [opts] - options for this instance if defined.
 */

export = ClassesManagerImpl;
