module.exports = function(RED) {
    "use strict";

    var global = RED.settings.functionGlobalContext;
    var presence = global.presence;

    function Node(config) {
        var self = this;

        RED.nodes.createNode(this,config);

        var id = config.pid;
        
        var node = this;

        this.on("input", function(msg) {
            presence.bump(id);
        });
    }

    RED.nodes.registerType("bump-presence",Node);

};
