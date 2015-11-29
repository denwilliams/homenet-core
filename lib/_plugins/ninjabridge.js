var socketIoClient = require('socket.io-client');
function createClient(url, logger, sensorCallback) {

  logger.info('Connecting to Ninjabridge ' + url);
  var socket = socketIoClient(url);

  socket.on('connect', function() {
    logger.info('Ninjabridge connected');
  });
  socket.on('disconnect', function() {
    logger.info('Ninjabridge disconnected');
  });
  
  socket.on('0_0_11.rfsensor', sensorCallback);

  // socket.on('event', function(data) {
  //  console.log('event', data);
  // });

  return socket;
}

function createBridges(bridgeConfigs, logger, sensorCallback) {
  var bridges = {};

  bridgeConfigs.forEach(function(b) {
    var url = 'http://' + b.host + ':3000';
    bridges[b.id] = createClient(url, logger, sensorCallback.bind(null, b.id));
  });

  return bridges;
}

function createTriggers(config, logger) {
  var triggers = {};
  config.instances
  .filter(function(i) {
    return i.class === 'sensor' && i.type === 'ninja';
  })
  .forEach(function(i) {
    var id = i.id;
    var opts = i.options;
    var triggerId = opts.bridge+'.'+opts.deviceName;

    logger.info('Ninjabridge homnet trigger defined: ' + triggerId + ' -> ' + id);
    triggers[triggerId] = id;
  });

  return triggers;
}

function ninjaBridgeFactory(config, sensors, logger) {
  logger.info('Starting Ninja RF sensors via NinjaBlock Bridge');

  var bridgeConfigs = (config.ninjaBlocks || {}).bridges || [];
  //var ninjaSensors = ninjaConfig.sensors || {};

  var bridges = createBridges(bridgeConfigs, logger, sensorCallback);
  var triggers = createTriggers(config, logger);

  function sensorFactory(id, opts) {
    var sensor = new NinjaSensor(id, opts);
    return sensor;
  }

  function NinjaSensor(id, opts) {
    sensors.BaseType.call(this, id, {
      mode: 'trigger',
      timeout: opts.timeout,
      zone: opts.zone
    });
  }
  sensors.BaseType.extend(NinjaSensor);

  function sensorCallback(bridgeId, data){
    logger.debug('Got RF sensor data from bridge ' + bridgeId + ': ' + JSON.stringify(data));
    var triggerId = bridgeId + '.' + data.deviceName;
    var sensorId = triggers[triggerId];
    if (!sensorId) {
      logger.debug('Discared sensor info - no trigger');
      return;
    }
    logger.debug('Sensor triggered from Ninjabridge ' + sensorId);
    
    /** @type Sensor */
    var sensor = sensors.getInstance(sensorId);
    if (!sensor) {
      logger.warn('Cannot find sensor with ID ' + sensorId);
      return;
    }
    sensor.trigger();
  }


  return sensorFactory;
}

module.exports = exports = ninjaBridgeFactory;
