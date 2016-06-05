import _ = require('lodash');
import {inject, injectable} from 'inversify';
// import {Homenet} from '../interfaces.d.ts';
import chalk = require('chalk');

/**
 * Container for managing/holding class contructors/factories and class instances
 * @class ClassesManager
 * @param {Logger} logger - logger instance
 */
@injectable()
class ClassesManager implements Homenet.IClassesManager {

  private _classes : Homenet.Dict<Homenet.IClassFactory<any>>;
  private _logger : Homenet.ILogger;
  private _instances : Homenet.InstancesDict<any>;

  constructor(@inject('ILogger') logger : Homenet.ILogger) {
    this._classes = {};
    this._instances = {};
    this._logger = logger;
  }

  /**
   * Adds a new class and a factory to instantiate instances of that class
   * @param {string} classId - unique ID of a class
   * @param {ClassesManager.classFactory} classFactory - factory for creating instances
   */
  addClass<T>(classId: string, classFactory: Homenet.IClassFactory<T>) : void {
    this._logger.info('Adding class ' + chalk.cyan(classId));
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
    this._logger.debug('Adding instance of class ' + chalk.cyan(classId) + ' with ID ' + chalk.magenta(instanceId));
    var factory : Homenet.IClassFactory<T> = this._classes[classId];
    if (typeof factory !== 'function') {
      throw new Error('No class factory found for ' + classId + ' (' + typeId + '/' + instanceId +')');
    }
    var id: string = classId + '.' + instanceId;
    this._instances[id] = factory(instanceId, typeId, opts);
  }

  /**
   * Gets an existing instance
   * @param {string} classId
   * @param {string} instanceId
   * @return {*} class instance
   */
  getInstance<T>(classId: string, instanceId: Homenet.InstanceOrFactory<T>) : T {
    var id: string = classId + '.' + instanceId;
    var instance = this._instances[id];
    if (!instance) {
      this._logger.warn('No instance with ID ' + id);
    }
    if (typeof instance === 'function') return (<() => T>instance)();
    return instance;
  }
  //
  //
  // /**
  //  * Creates a new instance of a class
  //  * @callback classFactory
  //  * @memberOf ClassesManager
  //  * @param {string} instanceId - unique ID for this instance
  //  * @param {string} [typeId] - type ID that represents a variant of the class. Only passed if this class defines multiple types.
  //  * @param {*} [opts] - options for this instance if defined.
  //  */
  // _lazySingleton<T>(instanceId, typeId, opts) {
  //   var instance = null;
  //   var Constructor = this._classes[]
  //   return function() : T {
  //
  //   }
  // }

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
      var instance : any = (typeof factory === 'function') ? (<Homenet.InstanceOrFactory<any>>factory)() : factory;
      //if (typeof instance.initialize === 'function') instance.initialize();
    });
    this._logger.info('Done initializing');
  }

}

export = ClassesManager;
