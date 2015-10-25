var _ = require('lodash');

/**
 * @constructor
 * @example
 * switchManager.addType('lights:hue', switchSpec);
 * switchManager.addInstance('loungeroom:lights', 'lights:hue');
 * switchManager.set('loungeroom:lights', true)
 * var lights = switchManager.get('loungeroom:lights');
 */
function SwitchManager(eventBus, logger) {
  this._logger = logger;
  this._eventBus = eventBus;
  this.types = {};
  this.instances = {};
  this.categories = {};
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
 * @member Switch#set
 */
/**
 * get switch state
 * @member Switch#get
 */
/**
 * set switch state
 * @member Switch#set
 */
/**
 * @property {string} category - category this switch will be listed in
 */

/**
 * Adds a switch type.
 * @param {string} typeId - identifier for the type
 * @param {SwitchManager~switchFactory} switchFactory - get and set implementations, and optional categories
 */
SwitchManager.prototype.addType = function(typeId, switchFactory) {
  this._logger.info('Adding switch type ' + typeId);
  this.types[typeId] = switchFactory;
};

/**
 * Adds a new instance to the manager
 * @param {string} instanceId - unique ID for this instance
 * @param {string} typeId - type ID to be applied to this instance
 */
SwitchManager.prototype.addInstance = function(typeId, instanceId, opts) {
  var id = getId(typeId, instanceId);
  this._logger.debug('Adding switch ' + instanceId + ' of type ' + typeId);
  this.instances[id] = this._createSingletonInstance(typeId, id, opts);
};

SwitchManager.prototype.getAll = function() {
  return _.mapValues(this.instances, function(f) { return f(); });
};

/**
 * Sets switch state
 * @param  {string} instanceId - the ID of the instance to set
 * @param  {*} value  - the new value
 */
SwitchManager.prototype.set = function(typeId, instanceId, value, done) {
  this._logger.debug('Setting switch ' + typeId +'.'+ instanceId + ' ' + value);
  var instance = this.get(typeId, instanceId);
  var result = instance.set(value, done);
  this._eventBus.emit('switch.'+instanceId, null, value);
};

/**
 * Gets switch state
 * @param  {string} instanceId - the ID of the instance to run a command on
 * @return {*} the most recent value
 */
SwitchManager.prototype.get = function(typeId, instanceId) {
  var id = getId(typeId, instanceId);
  console.log(id);
  var factory = this.instances[id];
  console.log(factory);
  var instance = factory();
  console.log(instance);
  return instance;
};

SwitchManager.prototype._getType = function(typeId) {
  return this.types[typeId];
};

SwitchManager.prototype._createSingletonInstance = function(typeId, id, opts) {
  var factory = this._getType(typeId);
  return singleton(factory, id, opts);
  // todo: add to categories based on type
};

function getId(typeId, instanceId) {
  if (instanceId) return typeId+'.'+instanceId;
  return typeId;
}

function singleton(factory, id, opts) {
  var instance;
  return function() {
    if (!instance) instance = factory(opts);
    return instance;
  };
}

module.exports = exports = SwitchManager;
