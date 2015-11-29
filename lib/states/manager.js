function StateManager(eventBus, logger) {
  this._types = {};
  this._eventBus = eventBus;
  this._logger = logger;
}

/**
 * Add 
 * @param {string} typeId - unique id for type
 * @param {StateProvider} provider - provide state information for this type
 */
StateManager.prototype.addType = function(typeId, provider) {
  this._types[typeId] = provider;
  this._logger.debug('Defined state type: '+typeId);
};

StateManager.prototype.getType = function(typeId) {
  return this._types[typeId];
};

StateManager.prototype.getTypes = function() {
  return this._types;
};

StateManager.prototype.setCurrent = function(typeId, state) {
  this._logger.info('Setting ' + typeId + ' state to ' + state);
  var type = this.getType(typeId);
  if (!type.setCurrent) {
    this._logger.warn('Could not set state for type ' + typeId + ' - no setCurrent method defined');
    return;
  }
  var result = type.setCurrent(state);
  if (type.emitOnSet) {
    this.emitState(typeId, state);
  }
  return result;
};

StateManager.prototype.emitState = function(typeId, state) {
  this._eventBus.emit('state', typeId, state);
};

StateManager.prototype.getCurrent = function(typeId) {
  return this.getType(typeId).getCurrent();
};

StateManager.prototype.getAvailable = function(typeId) {
  return this.getType(typeId).getAvailable();
};


/**
 * @interface StateProvider
 */
/**
 * @member StateProvider#getCurrent
 */
/**
 * @member StateProvider#setCurrent
 */
/**
 * @member StateProvider#getAvailable
 */

module.exports = exports = StateManager;