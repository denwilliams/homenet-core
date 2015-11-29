/**
 * The power module allows for controlling and managing connected locks.
 * @module power
 */
var IMPLEMENTS = 'power';
var INJECT = ['classes', 'commands', 'switches', 'logger', 'config', 'utils'];

function factory(services) {
  var classes = services.classes;
  var commands = services.commands;
  var switches = services.switches;
  var utils = services.utils;
  var logger = services.logger.getLogger(IMPLEMENTS);
  logger.info('Starting '+IMPLEMENTS+' module');

  var Power = require('./power').load();

  var manager = new utils.ClassTypeManager('power', Power, onAddInstance, logger);
  manager.addToClasses(classes);
  switches.addType('power', function(opts) {
    return manager.getInstance(opts.id);
  });
  commands.addType('power', function(opts) {
    var instance = manager.getInstance(opts.id);
    return {
      turnOn: function() {
        instance.set(true);
      },
      turnOff: function() {
        instance.set(false);
      }
    };
  }, {
    "turnOn": {},
    "turnOff": {}
  });

  return manager;

  // ------ private functions -------

  function onAddInstance(instance, instanceId, typeId, opts) {
    switches.addInstance('power', instanceId, {id: instanceId});
    commands.addInstance('power', instanceId, {id: instanceId});
  }
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;

