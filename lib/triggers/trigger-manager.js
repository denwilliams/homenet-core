var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

/**
 * @constructor
 * @example
 * var myTrigger = triggerManager.add('sensors', 'loungeroom');
 *
 * myTrigger.on('trigger', handler);
 * myTrigger.trigger();
 *
 * triggerManager.onTrigger('sensors', 'loungeroom', handler);
 * triggerManager.trigger('sensors', 'loungeroom');
 */
function TriggerManager(eventBus, logger) {
  this._logger = logger;
  this._eventBus = eventBus;

  this.instances = {};
}

var Trigger = require('./trigger');

/**
 * Adds a trigger.
 */
TriggerManager.prototype.add = function(typeId, instanceId, emitter) {
  var eventBus = this._eventBus;
  var id = typeId+'.'+instanceId;
  var instance = this.instances[id] = new Trigger(id, emitter || new EventEmitter());
  instance.onTrigger(function(data) {
    eventBus.emit('trigger.'+id, null, data);
  });
  return instance;
};

TriggerManager.prototype.getAll = function() {
  return _.values(this.instances);
};

TriggerManager.prototype.get = function(typeId, instanceId) {
  var id = getId(typeId, instanceId);
  return this.instances[id];
};

TriggerManager.prototype.trigger = function(typeId, instanceId, data) {
  this.get(typeId, instanceId).trigger(listener);
};

function getId(typeId, instanceId) {
  if (instanceId) return typeId+'.'+instanceId;
  return typeId;
}

/**
 * Listens for a trigger
 */
TriggerManager.prototype.onTrigger = function(typeId, instanceId, listener) {
  var id = typeId+'.'+instanceId;
  this.instances[id].onTrigger(listener);
};

module.exports = exports = TriggerManager;
