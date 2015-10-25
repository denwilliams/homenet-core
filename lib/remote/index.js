/**
 * Trigger sensors and fire events.
 * @see module:sensors~SensorManager
 * @module sensors
 */

var IMPLEMENTS = 'remotes';
var INJECT = ['config', 'eventBus', 'logger', 'presence', 'triggers', 'values', 'classes', 'utils'];

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
  var logger = services.logger.getLogger(IMPLEMENTS);
  var Remote = null;// require('./sensor').load(triggers, values);

  var manager = new utils.ClassTypeManager('remote', Remote, onAddInstance, logger);
  manager.addToClasses(classes);

  return manager;
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;
