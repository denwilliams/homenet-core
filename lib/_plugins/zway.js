var zway = require('node-zway');
var controllers = null;
var _ = require('lodash');

exports.locks = function createZwayLocksFactory(locks, config, logger) {
  controllers = createControllers(config);

  function ZwayLock(id, opts) {
    this.deviceId = opts.id;
    this.state = 'unknown';

    this._controller = controllers[opts.controller];
    this._device = this._controller.getDevice(this.deviceId, [98]);
  }
  ZwayLock.prototype.set = function(value) {
    this.state  = value;
    logger.info('SET ZWAY LOCK STATE TO ' + value);
    this._setZwayLock(value);
  };
  ZwayLock.prototype.get = function() {
    return this.state;
  };
  ZwayLock.prototype._setZwayLock = function(value) {
    var doorLock = this._device.DoorLock;
    if (!doorLock) return;

    if (value) {
      doorLock.lock()
      .then(function() {
        console.log('OK');
      })
      .fail(function(err) {
        console.error(err);
      });
    } else {
      doorLock.unlock();
    }
  };

  function zwayLockFactory(id, opts) {
    logger.info('Adding Zway lock: ' + id);
    return new ZwayLock(id, opts);
  }

  return zwayLockFactory;
};

exports.power = function createZwayLocksFactory(power, config, logger) {
  controllers = createControllers(config);

  function ZwayPower(id, opts) {
    this.deviceId = opts.id;
    this.state = 'unknown';

    this._controller = controllers[opts.controller];
    this._device = this._controller.getDevice(this.deviceId, [37]);
  }
  ZwayPower.prototype.set = function(value) {
    this.state  = value;
    logger.info('SET ZWAY POWER STATE TO ' + value);
    this._setZwayPower(value);
  };
  ZwayPower.prototype.get = function() {
    return this.state;
  };
  ZwayPower.prototype._setZwayPower = function(value) {
    var switchBinary = this._device.SwitchBinary;
    if (!switchBinary) return;

    if (value) {
      switchBinary.activate();
    } else {
      switchBinary.deactivate();
    }
  };
  function zwayPowerFactory(id, opts) {
    logger.info('Adding Zway power: ' + id);
    return new ZwayPower(id, opts);
  }
  return zwayPowerFactory;
};

exports.sensors = function createZwaySensorsFactory(sensors, config, logger) {
  controllers = createControllers(config);

  var triggers = createTriggers(config, logger);
  _.each(controllers, function(controller) {
    monitor(controller, 48, sensorCallback);
  });

  function sensorCallback(e) {
    // var deviceId = e.deviceId;
    logger.debug('Got ZWay sensor data ' + JSON.stringify(e));
  }

  /**
   * @classdesc Sensors implemention from Z-Way
   * @constructor ZwaySensor
   * @extends {Sensor}
   * @param {String} id   [description]
   * @param {Object} opts z-way options
   * @param {string} opts.controller
   * @param {string} opts.deviceId
   */
  function ZwaySensor(id, opts) {
    sensors.BaseType.call(this, id, {
      mode: 'toggle',
      zone: opts.zone
    });
  }
  sensors.BaseType.extend(ZwaySensor);

  function zwaySensorFactory(id, opts) {
    logger.info('Adding Zway sensor: ' + id);
    return new ZwaySensor(id, opts);
  }

  return zwaySensorFactory;
};


function createTriggers(config, logger) {
  var triggers = {};
  config.instances
  .filter(function(i) {
    return i.class === 'sensor' && i.type === 'zway';
  })
  .forEach(function(i) {
    var id = i.id;
    var opts = i.options;
    var triggerId = opts.controller+'.'+opts.deviceId;

    logger.info('Z-Way homenet trigger defined: ' + triggerId + ' -> ' + id);
    triggers[triggerId] = id;
  });

  return triggers;
}

function createControllers(config) {
  // dont recreate
  if (controllers) return controllers;

  var result = {};
  (config.zway || []).controllers.forEach(function(c) {
    result[c.id] = createController(c);
  });

  return result;
}

function createController(conf, logger) {
  var id = conf.id;
  var host = conf.host;
  var port = conf.port || 8083;

  var deviceApi = new zway.DeviceApi(host);
  deviceApi.onAny(function(e) {
    console.log(e);
  });
  deviceApi.poll(2500);
  return deviceApi;
}

function monitor(controller, cclassId, listener) {
  //controller.on('*.98.*', onLockEvent);
  //controller.on('*.48.*', onSensorEvent);
  controller.on('*', cclassId, '*', listener);

//   function onLockEvent(evt) {
//   }

//   function onSensorEvent(evt) {
//     var deviceId = evt.deviceId;
//     logger.info('Got ZWay sensor data ' + JSON.stringify(evt));
// //    sensors.trigger(deviceId, true);
//   }

}
