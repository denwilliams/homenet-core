var chalk = require('chalk');

exports.power = createVirtualPowerFactory;
exports.sensors = createVirtualSensorFactory;
exports.lights = createVirtualLightFactory;
exports.locks = createVirtualLockFactory;

function createVirtualPowerFactory(power) {
  function virtualPowerFactory(id,opts) {
    return new VirtualPower(id, opts);
  }

  function VirtualPower(id, opts) {
    power.BaseType.call(this, id);
  }
  power.BaseType.extend(VirtualPower);
  VirtualPower.prototype.set = function(value) {
    power.BaseType.prototype.set.apply(this, arguments);
  };

  return virtualPowerFactory;
}


function createVirtualSensorFactory(sensors) {

  function virtualSensorFactory(id,opts) {
    return new VirtualSensor(id, opts);
  }

  function VirtualSensor(id, opts) {
    sensors.BaseType.call(this, id, opts);
  }
  sensors.BaseType.extend(VirtualSensor);

  return virtualSensorFactory;

}

function createVirtualLightFactory() {
  function VirtualLight(id, opts) {
    this.hub = opts.hub;
    this.id = opts.id;
    this.state = 'unknown';
  }
  VirtualLight.prototype.set = function(value, done) {
    this.state  = value;
    console.log(chalk.cyan('SET LIGHT STATE TO ' + value));
    if (done) done();
  };
  VirtualLight.prototype.get = function() {
    return this.state;
  };

  function virtualLightFactory(id, opts) {
    return new VirtualLight(id, opts);
  }

  return virtualLightFactory;
}

function createVirtualLockFactory() {

  function virtualLockFactory(id, opts) {
    return new VirtualLock(id, opts);
  }

  function VirtualLock(id, opts) {
    this.controller = opts.controller;
    this.id = opts.id;
    this.state = 'unknown';
  }

  VirtualLock.prototype.set = function(value, done) {
    this.state  = value;
    console.log(chalk.cyan('SET LOCK STATE TO ' + value));
    if (done) done();
  };

  VirtualLock.prototype.get = function() {
    return this.state;
  };

  return virtualLockFactory;

}
