/**
 * @classdesc Emits events when triggered
 * @constructor
 * @param {eventEmitter} eventEmitter - the event emitter to use to emit events
 */
function Trigger(id, eventEmitter) {
  this.id = id;
  this.lastTriggered = null;
  this._emitTrigger = eventEmitter.emit.bind(eventEmitter, 'trigger', true);

  /**
   * @method Trigger#onTrigger
   */
  this.onTrigger = eventEmitter.on.bind(eventEmitter, 'trigger');
}

/**
 * Triggers this instance
 */
Trigger.prototype.trigger = function() {
  this._emitTrigger();
  this.lastTriggered = new Date();
};


module.exports = exports = Trigger;