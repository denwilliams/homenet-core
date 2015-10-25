module.exports = function(RED) {
    "use strict";

    var global = RED.settings.functionGlobalContext;
    var scene = global.scene;
    var eventBus = global.eventBus;
    
    function Node(config) {
        RED.nodes.createNode(this,config);

        var node = this;

        var origScene = scene.currentId;

        setTimeout(updateStatus,10);

        eventBus.on('scene', 'changed', updateStatus);

        this.on('close', function() {
          eventBus.removeListener('scene', 'changed', updateStatus);
        });

        function updateStatus() {
          var newScene = scene.currentId;
          // we show it as RED if the scene is different from when loaded (ie: has changed)
          var color = (newScene !== origScene) ? 'red' : 'blue';
          node.status({fill:color,shape:"dot",text:newScene});
        }
    }

    RED.nodes.registerType("current-scene",Node);
};
