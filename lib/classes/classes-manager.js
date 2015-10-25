/**
 * Container for managing/holding class contructors/factories and class instances
 * @class ClassesManager
 * @param {Logger} logger - logger instance
 */
function ClassesManager(logger) {
  this.classes = {};
  this.instances = {};
  this._logger = logger;
}

/**
 * Creates a new instance of a class
 * @callback classFactory
 * @memberOf ClassesManager
 * @param {string} instanceId - unique ID for this instance
 * @param {string} [typeId] - type ID that represents a variant of the class. Only passed if this class defines multiple types.
 * @param {*} [opts] - options for this instance if defined.
 */

/**
 * Adds a new class and a factory to instantiate instances of that class
 * @param {string} classId - unique ID of a class
 * @param {ClassesManager.classFactory} classFactory - factory for creating instances
 */
ClassesManager.prototype.addClass = function(classId, classFactory) {
  this._logger.info('Adding class ' + classId);
  this.classes[classId] = classFactory;
};

/**
 * Add a new instance of a class
 * @param {string} classId    
 * @param {string} instanceId 
 * @param {string} typeId     
 * @param {*} opts
 */
ClassesManager.prototype.addInstance = function(classId, instanceId, typeId, opts) {
  var factory = this.classes[classId];
  this._logger.debug('Adding instance of class ' + classId + ' with ID ' + instanceId);
  var id = classId + '.' + instanceId;
  this.instances[id] = factory(instanceId, typeId, opts);
};

/**
 * Gets an existing instance
 * @param {string} classId    
 * @param {string} instanceId 
 * @return {*} class instance
 */
ClassesManager.prototype.getInstance = function(classId, instanceId) {
  var id = classId + '.' + instanceId;
  var instance = this.instances[id];
  if (!instance) {
    this._logger.warn('No instance with ID ' + id);
  }
  if (typeof instance === 'function') return instance();
  return instance;
};

module.exports = exports = ClassesManager;
