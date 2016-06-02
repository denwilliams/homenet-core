'use strict';

var NAME = 'sensor';

module.exports = function(RED) {

  var global = RED.settings.functionGlobalContext;
  var sensors = global.sensors;

  function NodeOut(config) {
    var self = this;
    var node = this;

    RED.nodes.createNode(this,config);

    var sensorId = config.sensorId;
    var sensor = sensors.getInstance(sensorId);
    console.log('DEBUG SENSOR', sensor);
    var value = config.value;

    this.on('input', function(msg) {
      sensor.trigger(value || msg.payload);
    });
  }

  function NodeIn(config) {
    RED.nodes.createNode(this, config);

    var self = this;
    var node = this;

    var sensorId = config.sensorId;
    var sensor = sensors.getInstance(sensorId);
    console.log('DEBUG SENSOR', sensor);

    sensor.onTrigger(onSensorTrigger);

    this.on('close', function() {
      sensor.removeOnTriggerListener(onSensorTrigger);
    });

    function onSensorTrigger(data) {
      var msg = {
        topic: 'sensor/'+sensorId,
        payload: data
      };
      node.send(msg);
    }
  }

  RED.nodes.registerType(NAME+' in', NodeIn);
  RED.nodes.registerType(NAME+' out', NodeOut);
};
