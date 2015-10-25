/**
 * The lights module allows for controlling and managing connected lights.
 * Injecting lights will provide a {@link LightsManager} instance.
 * @module lights
 * @see LightsManager
 */

var IMPLEMENTS = 'lights';
var INJECT = ['classes', 'commands', 'switches', 'logger', 'config', 'utils'];

var LightsManager = require('./lights-manager');

function factory(services) {
  var classes = services.classes;
  var commands = services.commands;
  var switches = services.switches;
  var config = services.config;
  var utils = services.utils;
  var logger = services.logger.getLogger('lights');
  logger.info('Starting '+IMPLEMENTS+' module');
  var Light = require('./light').load();

  var manager = new utils.ClassTypeManager('light', Light, onAddInstance, logger);
  manager.addToClasses(classes);
  switches.addType('light', function(opts) {
    return manager.getInstance(opts.id);
  });
  commands.addType('light', function(opts) {
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
    'turnOn': {
      "title": "Turn on",
      "comment": "Turn the light on"
    },
    'turnOff': {
      "title": "Turn off",
      "comment": "Turn the light off"
    }
  });

  return manager;

  // ------ private methods -------
  function onAddInstance(instance, instanceId, typeId, opts) {
    switches.addInstance('light', instanceId, {id: instanceId});
    commands.addInstance('light', instanceId, {id: instanceId});
  }
  //return new LightsManager(classes, switches, commands, config, logger);
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;
