var IMPLEMENTS = 'sensors';
var INJECT = ['config', 'eventBus', 'logger'];

var express = require('express');
// var bodyParser = require('body-parser');
var EventEmitter = require('events').EventEmitter;

function factory(services) {
  var sensConfig = services.config.sensors;
  var eventBus = services.eventBus;
  var logger = services.logger.getLogger('sensors');

  var sensors = {};
  var e = new EventEmitter();

  var app = express();
  // app.use(bodyParser.json());

  // method1
  app.use('/:id/:value', function(req, res) {
    handleWebhook(req.params.id, req.params.value, res);
  });

  // method2
  app.post('/:id', function(req, res) {
    handleWebhook(req.params.id, req.body, res);
  });

  sensConfig.forEach(function (sensor) {
    var id = sensor.id;
    logger.debug('Creating sensor: ' + id);
    sensors[id] = createSensor(sensor);
  });

  sensors.trigger = function (id, data) {
    sensors[id].trigger(data);
  };

  sensors.on = function (id, cb) {
    if (!sensors[id]) return;
    sensors[id].onTrigger(cb);
  };

  sensors.app = app;

  return sensors;

  //-----

  function createSensor(config) {
    switch(config.type) {
    case 'external':
      return createExternalSensor(config);
    }
    throw new Error('Unknown sensor type ' + config.type);
  }

  function createExternalSensor(config) {
    var currentData = null;
    var id = config.id;
    return {
      trigger: function(data) {
        currentData = data;
        e.emit(id, data);
        eventBus.emit('sensor', 'triggered', {id:id, data:data});
      },
      onTrigger: function(cb) {
        e.on(id, cb);
      },
      removeListener: function(cb) {
        e.removeListener(id, cb);
      },
      getCurrent: function() {
        return currentData;
      }
    };
  }

  function handleWebhook(id, value, res) {
    logger.debug('Sensor triggered from webhook: ' + id);
    var sensor = sensors[id];

    if (!sensor) {
      res.status(404).send({error:true,message:'Sensor not found'});
      return;
    }

    sensor.trigger(value);
    res.send({sensor:id, data:sensor.getCurrent()});
  }
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;
