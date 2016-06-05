module.exports = function(RED) {
    "use strict";

    var global = RED.settings.functionGlobalContext;
    //var ninja = global.ninja;

    function Node(config) {
        var self = this;

        RED.nodes.createNode(this,config);

        var device = config.device;
        var node = this;

        ninja.on(id, handleSensor);

        this.on('close', function() {
            //ninja.removeListener(id, handlePresence);
        });

        function handleSensor(data) {
            var msg = {
                topic: 'sensor/'+id,
                payload: data
            };
            node.send(msg);
        }
    }

    RED.nodes.registerType("devicesensor",Node);

};
