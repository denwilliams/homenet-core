/**
 * Shared event bus. Provides an {@link SharedEventEmitter} instance.
 * @see SharedEventEmitter
 * @module eventBus
 * @example
 * // events are emitted in the form of:
 * // "module.source.id"
 * // where module is the module actually emitting the event, thus defining the type of event, eg: 'triggers', 'commands'
 * // source is the source of the event, typically another module eg 'lights', 'locks', 'sensors'
 * // id is the instance ID
 * // for example:
 * e.on('triggers.sensors.hallway', listener);
 */

var IMPLEMENTS = 'eventBus';
var INJECT = ['logger'];

var sharedEventEmitter = require('./shared-event-emitter');

function factory(services) {
  return sharedEventEmitter.create();
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;
