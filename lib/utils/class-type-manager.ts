/// <reference path="../../interfaces/interfaces.d.ts" />

import lazySingleton = require('./lazy-singleton');

/**
  * Manages instances of a specific class
  * @class
  * @param {string} classId
  * @param {Class} BaseType - base type contructor to inherit from
  * @param {ClassTypeManager.onAddInstance} onAddInstance
  * @param {Logger} logger
  */
class ClassTypeManager<T> {
  
  private _logger: Logger;
  private _addInstance: ClassFactory<T>;
  private BaseType: Function;
  
  classId: string;
  instances: Dict<Func<T>>;
  types: Dict<ClassTypeFactory<T>>;
  
  constructor(classId: string, BaseType: Function, onAddInstance: OnAddInstanceCallback<T>, logger: Logger) {
        
    var instances: Dict<Func<T>> = {};
    var types: Dict<any> = {};
    
    this.classId = classId;
    this.types = types;
    this.instances = instances;

    this._logger = logger;
    this._addInstance = addInstance;
    this.BaseType = BaseType;

    logger.info('Starting '+classId+' manager');

    function addInstance(instanceId: string, typeId: string, opts: any) : T|Func<T> {
      logger.debug('Creating '+classId+' with ID ' + instanceId + ' of type ' + typeId);
      var instance: Func<T> = lazySingleton(createInstance, [typeId, instanceId, opts], null);
      instances[instanceId] = instance;
      onAddInstance(instance, instanceId, typeId, opts);
      return instance;
    }

    function createInstance(typeId: string, instanceId: string, opts: any) : T {
      logger.info('Creating '+classId+' instance of type ' + typeId);
      var typeFactory: ClassTypeFactory<T> = types[typeId];
      return typeFactory(instanceId, opts);
    }
  }

  /**
   * Adds this type manager instance to the classes module
   * @param {ClassesManager} classes - classes module
   */
  addToClasses(classes: ClassesManager) {
    classes.addClass(this.classId, this._addInstance);
  }

  /**
   * Adds a new light type
   * @param {string} typeId  - ID of the type
   * @param {function} factory - 
   */
  addType(typeId: string, factory: ClassTypeFactory<T>) {
    this._logger.info('Adding '+this.classId+' type ' + typeId);
    this.types[typeId] = factory;
  }

  /**
   * [getInstance description]
   * @param  {string} instanceId
   * @return {*} the instance
   */
  getInstance(instanceId: string) : T {
    var singletonProvider: Func<T> = this.instances[instanceId];
    if (singletonProvider) return singletonProvider();
    this._logger.warn('Cannot find instance ' + instanceId);
    return null;
  }

  /**
   * Gets all added instances
   * @return {Object<string,*>} an array of instances
   * @todo call factory methods
   */
  getAllInstances(): Dict<Func<T>> {
    return this.instances;
  }

}

export = ClassTypeManager;
