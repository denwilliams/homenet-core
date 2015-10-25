/**
 * Tests everything.
 * Require this module to test the core.
 * @module appTest
 */

module.exports = exports = factory;
exports.$implements = 'appTest';
exports.$inject = [
  'eventBus',
  'logger',
  'plugins',
  'classes',
  'values',
  'switches',
  'commands',
  'locks',
  'lights',
  'power',
  'sensors',
  'nodeRed',
  'loader'
];

function factory (services) {
  var logger = services.logger.getLogger('appTest');
  
  logger.info('Running app-test');

  services.eventBus.onAny(onEvent);

  var classes = services.classes;
  var lights = services.lights;
  var locks = services.locks;
  var loader = services.loader;
  var power = services.power;
  var sensors = services.sensors;

  console.log(locks.constructor.name);

  loader.load();

  var switches = services.switches;
  var commands = services.commands;
  var values = services.values;

  setTimeout(function() {
    //commands.addType('lights:hue', hueCommandsFactory);
    //commands.addInstance('livingroom:lights', 'lights:hue', { hub:'main', id:5 });
    switches.set('light', 'livingroom', 'full');
    commands.run('light', 'livingroom', 'turnOff');
    commands.run('power', 'livingroom', 'turnOff');
    switches.set('light', 'livingroom', 'low');
    switches.set('light', 'lounge', true);
    switches.set('lock', 'livingroom', false);
    commands.run('lock', 'livingroom', 'lock');
    logger.info('Current state:' + switches.get('light', 'livingroom'));
    switches.set('light', 'livingroom', 'off');
    var sensor = classes.getInstance('sensor', 'livingroom');
    sensor.trigger();
    values.set('sensor', 'livingroom', 'humidity', 100);
    sensor.set('temp', 10);
    console.log('Temp:', values.get('sensor', 'livingroom', 'temp'));
    console.log('Hum:', sensor.get('humidity'));

  }, 10000);


  logger.info('App tested');
}

function onEvent(evt) {
  console.log('**EVENT**', evt);
}

