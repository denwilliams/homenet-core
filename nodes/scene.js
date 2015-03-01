module.exports = function(RED) {
    "use strict";

    var global = RED.settings.functionGlobalContext;
    var scene = global.scene;

    function Node(config) {
        var self = this;

        RED.nodes.createNode(this,config);

        var sceneId = config.sceneId;
        
        var node = this;

        this.on("input", function(msg) {

            var id = sceneId || msg.payload;
            scene.set(id);

        });
    }

    RED.nodes.registerType("scene",Node);

};
