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
var milight = require('./milight');
var zway = require('./zway');
var ninjaBridge = require('./ninjabridge');

function factory(services) {
  var logger = services.logger;
  var config = services.config;
  var lights = services.lights;
  var locks = services.locks;
  var sensors = services.sensors;

  var vlogger = logger.getLogger('virtual');
  lights.addType('virtual', virtual.lights(lights), vlogger);
  locks.addType('virtual', virtual.locks(locks), vlogger);
  services.sensors.addType('virtual', virtual.sensors(services.sensors), vlogger);
  services.power.addType('virtual', virtual.power(services.power), vlogger);

  var huelog = logger.getLogger('hue');
  lights.addType('hue', hue(config, lights, huelog), huelog);

  var milightLog = logger.getLogger('milight');
  lights.addType('milight', milight(config, lights, milightLog), milightLog);

  var ninjaLog = logger.getLogger('ninjablocks');
  sensors.addType('ninja', ninjaBridge(config, sensors, ninjaLog), ninjaLog);
  var zwayLogger = logger.getLogger('zway');
  sensors.addType('zway', zway.sensors(sensors, config, zwayLogger), zwayLogger);

  locks.addType('zway', zway.locks(locks, config, zwayLogger), zwayLogger);

  // just to help with debugging
  return { module:'plugins' };
}

