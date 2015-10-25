var ValueStore = require('./value-store');

/**
 * @constructor
 * @example
 * valuesManager.addType('temperature:zway', switchSpec);
 * switchManager.addInstance('loungeroom:lights', 'lights:hue');
 * switchManager.set('loungeroom:lights', true)
 * var lights = switchManager.get('loungeroom:lights');
 */
function ValuesManager(eventBus, logger) {
  this._logger = logger;
  this._eventBus = eventBus;
  this.types = {};
  this.instances = {};
}

function getId(typeId, instanceId) {
  return typeId+'.'+instanceId;
}

/**
 * Adds a new instance to the manager
 * @param {string} instanceId - unique ID for this instance
 * @param {Array<string>|string} types - array of switch type IDs to be applied to this instance
 */
ValuesManager.prototype.addInstance = function(typeId, instanceId) {
  var id = getId(typeId, instanceId);
  var instance = this.instances[id] = new ValueStore(id, this._eventBus);
  return instance;
};

/**
 * Gets an instance by it's type and ID
 * @param  {string} typeId     
 * @param  {string} instanceId 
 * @return {ValueStore}
 */
ValuesManager.prototype.getInstance = function(typeId, instanceId) {
  var id = getId(typeId, instanceId);
  var instance = this.instances[instanceId];
  return instance;
};

/**
 * Sets value
 * @param  {string} instanceId - the ID of the instance to set
 * @param  {string} typeId     
 * @param  {string} key - the key
 * @param  {*} value  - the new value
 */
ValuesManager.prototype.set = function(typeId, instanceId, key, value) {
  var id = getId(typeId, instanceId);
  this.instances[id].set(key, value);
};

/**
 * Gets value
 * @param  {string} instanceId - the ID of the instance to run a command on
 * @param  {string} typeId     
 * @param  {string} key - the key
 * @return {*} the most recent value
 */
ValuesManager.prototype.get = function(typeId, instanceId, key) {
  var id = getId(typeId, instanceId);
  return this.instances[id].get(key);
};

module.exports = exports = ValuesManager;
