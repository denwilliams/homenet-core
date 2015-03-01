module.exports = function(RED) {
    "use strict";

    var global = RED.settings.functionGlobalContext;
    var lights = global.lights;

    function Node(config) {
        var self = this;

        RED.nodes.createNode(this,config);

        this.lightId = config.lightId;
        this.state = config.state;

        var node = this;

        this.on("input", function(msg) {

            lights[node.lightId](node.state || msg.payload);

        });
    }

    RED.nodes.registerType("lights",Node);

};
