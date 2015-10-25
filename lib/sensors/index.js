/**
 * Trigger sensors and fire events.
 * @see module:sensors~SensorManager
 * @module sensors
 */
var IMPLEMENTS = 'sensors';
var INJECT = [
  'config',
  'eventBus',
  'logger',
  'presence',
  'triggers',
  'values',
  'classes',
  'utils'
];

var express = require('express');
var bodyParser = require('body-parser');
var EventEmitter = require('events').EventEmitter;

function factory(services) {
  var sensConfig = services.config.sensors;
  var utils = services.utils;
  var eventBus = services.eventBus;
  var presence = services.presence;
  var triggers = services.triggers;
  var values = services.values;
  var classes = services.classes;
  var logger = services.logger.getLogger('sensors');
  var Sensor = require('./sensor').load(triggers, values);

  var manager = new utils.ClassTypeManager('sensor', Sensor, onAddInstance, logger);
  manager.addToClasses(classes);

  return manager;

  function onAddInstance(instance, instanceId, typeId, opts) {
    triggers.onTrigger(typeId, instanceId, function(e) {

    });
  }

  /**
   * Manages and triggers sensors
   * @class module:sensors~SensorManager
   */
  var sensors = {};
  var e = new EventEmitter();

  /**
   * Express app routes
   * @alias module:sensors~SensorManager#app
   */
  var app = express();
  app.use(bodyParser.json());

  // method1
  app.use('/:id/:value', function(req, res) {
    handleWebhook(req.params.id, req.params.value, res);
  });

  // method2
  app.post('/:id', function(req, res) {
    handleWebhook(req.params.id, req.body, res);
  });

  sensConfig.forEach(function (config) {
    var id = config.id;
    logger.debug('Creating sensor: ' + id);
    var sensor = sensors[id] = createSensor(config);

    if (config.timeout) {
      sensor.presence = presence.add('sensor:'+id, {category:'sensor', name:id, timeout:config.timeout});
      if (config.zones) {
        config.zones.forEach(function(zone) {
          presence.addParent('sensor:'+id, 'zone:'+zone);
        });
      }
    }

  });

  /**
   * Triggers a sensor by it's ID
   * @method module:sensors~SensorManager#trigger
   * @param  {string} id   - The ID of the sensor
   * @param  {mixed} data - Data to pass with the sensor event
   */
  sensors.trigger = function (id, data) {
    sensors[id].trigger(data);
  };

  /**
   * Listens for events fired by a specific sensor
   * @method module:sensors~SensorManager#on
   * @public
   * @param  {string}   id - The ID of the sensor
   * @param  {Function} cb 
   */
  sensors.on = function (id, cb) {
    if (!sensors[id]) return;
    sensors[id].onTrigger(cb);
  };

  sensors.app = app;

  return sensors;

  //-----

  function createSensor(config) {
    switch(config.type) {
      //case 'external':
      default:
        return createExternalSensor(config);
    }
    // throw new Error('Unknown sensor type ' + config.type);
  }

  function createExternalSensor(config) {
    var currentData = null;
    var id = config.id;
    return {
      trigger: function(data) {
        currentData = data;
        e.emit(id, data);
        eventBus.emit('sensor', 'triggered', {id:id, data:data});
        if (this.presence) this.presence.present();
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

    if (value === 'true') value = true;
    else if (value === 'false') value = false;

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
