module.exports = function(RED) {
    "use strict";

    var global = RED.settings.functionGlobalContext;
    var lights = global.lights;

    function Node(config) {
        var self = this;

        RED.nodes.createNode(this,config);

        this.lightId = config.lightId;
        this.state = config.state;

        var opts = (config.duration) ? undefined : {duration:config.duration};

        var node = this;

        this.on("input", function(msg) {

            lights[node.lightId](node.state || msg.payload, opts);

        });
    }

    RED.nodes.registerType("lights",Node);

};
