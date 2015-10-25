/**
 * @classdesc Key value store
 * @class
 * @param {string} id - id of this instance
 * @todo persist key values and load
 */
function ValueStore(id, eventBus) {
  this.id = id;
  this._eventBus = eventBus;
  this._values = {};
}

/**
 * Sets a value
 * @param {string} key   
 * @param {*} value value
 */
ValueStore.prototype.set = function(key, value) {
  this._values[key] = value;
  this._eventBus.emit('value.'+this.id, key, {key:key,value:value});
};

/**
 * Gets a value
 * @param  {string} key 
 * @return {*}     value
 */
ValueStore.prototype.get = function(key) {
  return this._values[key];
};

module.exports = exports = ValueStore;