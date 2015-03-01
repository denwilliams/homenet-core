var NAME = 'sensor';

module.exports = function(RED) {
    'use strict';

    var global = RED.settings.functionGlobalContext;
    var sensors = global.sensors;

    function NodeOut(config) {
        var self = this;
        var node = this;

        RED.nodes.createNode(this,config);

        var sensorId = config.sensorId;
        var sensor = sensors[sensorId];
        var value = config.value;

        this.on('input', function(msg) {

            sensor.trigger(value || msg.payload);

        });
    }

    function NodeIn(config) {
        var self = this;
        var node = this;

        RED.nodes.createNode(this,config);

        var sensorId = config.sensorId;
        var sensor = sensors[sensorId];

        sensor.onTrigger(onSensorTrigger);

        this.on('close', function() {

            sensor.removeListener(onSensorTrigger);

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
