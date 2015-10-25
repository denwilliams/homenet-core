/**
 * The locks module allows for controlling and managing connected locks.
 * Injecting locks will provide a {@link module:locks.LocksManager} instance.
 * @module locks
 */
var IMPLEMENTS = 'locks';
var INJECT = ['classes', 'commands', 'switches', 'logger', 'config', 'utils'];

function factory(services) {
  var classes = services.classes;
  var commands = services.commands;
  var switches = services.switches;
  var config = services.config;
  var utils = services.utils;
  var logger = services.logger.getLogger('locks');
  logger.info('Starting '+IMPLEMENTS+' module');
  var Lock = require('./lock').load();

  var manager = new utils.ClassTypeManager('lock', Lock, onAddInstance, logger);
  manager.addToClasses(classes);
  switches.addType('lock', function(opts) {
    return manager.getInstance(opts.id);
  });
  commands.addType('lock', function(opts) {
    var instance = manager.getInstance(opts.id);
    return {
      lock: function() {
        instance.set(true);
      },
      unlock: function() {
        instance.set(false);
      }
    };
  }, {
    'lock': {
      "title": "Lock",
      "comment": "Lock the device"
    },
    'unlock': {
      "title": "Unlock",
      "comment": "Unlock the device"
    }
  });

  return manager;

  // ------ private functions -------

  function onAddInstance(instance, instanceId, typeId, opts) {
    switches.addInstance('lock', instanceId, {id: instanceId});
    commands.addInstance('lock', instanceId, {id: instanceId});
  }
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;

