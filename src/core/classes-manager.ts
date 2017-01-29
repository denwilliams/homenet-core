import _ = require('lodash');
import { inject, injectable } from 'inversify';
import chalk = require('chalk');

/**
 * Container for managing/holding class contructors/factories and class instances
 * @class ClassesManager
 * @param {Logger} logger - logger instance
 */
@injectable()
export class ClassesManager implements Homenet.IClassesManager {

  private classes : Homenet.Dict<Homenet.IClassFactory<any>>;
  private instances : Homenet.InstancesDict<any>;

  constructor(
      @inject('ILogger') private logger: Homenet.ILogger,
      @inject('IZoneManager') private  zones: Homenet.IZoneManager
      ) {
    this.classes = {};
    this.instances = {};
  }

  /**
   * Adds a new class and a factory to instantiate instances of that class
   * @param {string} classId - unique ID of a class
   * @param {ClassesManager.classFactory} classFactory - factory for creating instances
   */
  addClass<T>(classId: string, classFactory: Homenet.IClassFactory<T>) : void {
    this.logger.info('Adding class ' + chalk.cyan(classId));
    this.classes[classId] = classFactory;
  };

  /**
   * Add a new instance of a class
   * @param {string} classId
   * @param {string} instanceId
   * @param {string} typeId
   * @param {*} opts
   */
  addInstance<T>(classId: string, instanceId: string, typeId: string, opts: any) : void {
    this.logger.debug('Adding instance of class ' + chalk.cyan(classId) + ' with ID ' + chalk.magenta(instanceId));
    var factory : Homenet.IClassFactory<T> = this.classes[classId];
    if (typeof factory !== 'function') {
      throw new Error('No class factory found for ' + classId + ' (' + typeId + '/' + instanceId +')');
    }
    var key: string = classId + '.' + instanceId;
    const inst = factory(instanceId, typeId, opts);
    const instance = {
      class: classId,
      type: typeId,
      id: instanceId,
      key: key,
      zone: opts && (opts.zone || opts.zoneId) || undefined,
      // command: details.command,
      // switch: details.switch,
      // trigger: details.trigger,
      // value: details.value,
      instance: inst
    };

    this.instances[key] = instance;
  }

  /**
   * Gets an existing instance
   * @param {string} classId
   * @param {string} instanceId
   * @return {*} class instance
   */
  getInstance<T>(classId: string, instanceId: Homenet.InstanceOrFactory<T>) : T {
    var id: string = classId + '.' + instanceId;
    var instance = this.instances[id];
    if (!instance || !instance.instance) {
      this.logger.warn('No instance with ID ' + id);
    }
    if (typeof instance.instance === 'function') return (<() => T>instance.instance)();
    return instance.instance;
  }

  /**
   * Gets all existing instances
   */
  getInstances() : any[] {
    return _.map(this.instances, (i) => typeof i.instance === 'function' ? i.instance() : i.instance);
  }

  /**
   * Gets all existing instances
   */
  getInstancesDetails() : {key: string, class: string, type: string, id: string, value: any}[] {
    return _.values(this.instances);
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
    this.logger.info('Initializing all class instances...');
    _.each(this.instances, (factory, key) => {
      this.logger.info('Initializing ' + key);
      const instance : any = (typeof factory === 'function') ? (<Homenet.InstanceOrFactory<any>>factory)() : factory;
      //if (typeof instance.initialize === 'function') instance.initialize();
    });
    this.logger.info('Done initializing');
  }

}
