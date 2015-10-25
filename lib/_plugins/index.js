module.exports = exports = factory;
exports.$implements = 'plugins';
exports.$inject = [
  'config',
  'logger',
  'locks',
  'lights',
  'power',
  'sensors'
];

var virtual = require('./virtual');
var hue = require('./hue');
var zway = require('./zway');

function factory(services) {
  var logger = services.logger;
  var config = services.config;
  var lights = services.lights;
  var locks = services.locks;

  var vlogger = logger.getLogger('virtual');
  lights.addType('virtual', virtual.lights(lights), vlogger);
  locks.addType('virtual', virtual.locks(locks), vlogger);
  services.sensors.addType('virtual', virtual.sensors(services.sensors), vlogger);
  services.power.addType('virtual', virtual.power(services.power), vlogger);

  var huelog = logger.getLogger('hue');
  lights.addType('hue', hue(config, lights, huelog), huelog);

  var zwayLogger = logger.getLogger('zway');
  locks.addType('zway', zway.locks(locks, zwayLogger), zwayLogger);

  // just to help with debugging
  return { module:'plugins' };
}

