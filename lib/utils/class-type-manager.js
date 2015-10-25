var lazySingleton = require('./lazy-singleton');

exports.load = function(classes) {
  /**
   * Manages instances of a specific class
   * @class
   * @param {string} classId
   * @param {Class} BaseType - base type contructor to inherit from
   * @param {ClassTypeManager.onAddInstance} onAddInstance
   * @param {Logger} logger
   */
  function ClassTypeManager(classId, BaseType, onAddInstance, logger) {
    
    /**
     * Called after an instance has been added by a class type manager.
     * @callback ClassTypeManager.onAddInstance
     * @param {*} instance
     * @param {string} instanceId
     * @param {string} typeId
     * @param {Object} opts
     */
    
    var instances = {};
    var types = {};
    
    this.classId = classId;
    this.types = types;
    this.instances = instances;

    this._logger = logger;
    this._addInstance = addInstance;
    this.BaseType = BaseType;

    logger.info('Starting '+classId+' manager');

    function addInstance(instanceId, typeId, opts) {
      logger.debug('Creating '+classId+' with ID ' + instanceId + ' of type ' + typeId);
      var instance = lazySingleton(createInstance, [typeId, instanceId, opts]);
      instances[instanceId] = instance;
      onAddInstance(instance, instanceId, typeId, opts);
      return instance;
    }

    function createInstance(typeId, instanceId, opts) {
      logger.info('Creating '+classId+' instance of type ' + typeId);
      var typeFactory = types[typeId];
      return typeFactory(instanceId, opts);
    }
  }

  /**
   * Adds this type manager instance to the classes module
   * @param {ClassesManager} classes - classes module
   */
  ClassTypeManager.prototype.addToClasses = function(classes) {
    classes.addClass(this.classId, this._addInstance);
  };

  /**
   * Adds a new light type
   * @param {string} typeId  - ID of the type
   * @param {function} factory - 
   */
  ClassTypeManager.prototype.addType = function(typeId, factory) {
    this._logger.info('Adding '+this.classId+' type ' + typeId);
    this.types[typeId] = factory;
  };

  /**
   * [getInstance description]
   * @param  {string} instanceId
   * @return {*} the instance
   */
  ClassTypeManager.prototype.getInstance = function(instanceId) {
    var singletonProvider = this.instances[instanceId];
    if (singletonProvider) return singletonProvider();
    this._logger.warn('Cannot find instance ' + instanceId);
    return null;
  };

  /**
   * [getAllInstances description]
   * @return {[type]} [description]
   */
  ClassTypeManager.prototype.getAllInstances = function() {
    // body...
  };

  return ClassTypeManager;
};
