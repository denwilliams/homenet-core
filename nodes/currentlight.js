module.exports = function(RED) {
    "use strict";

    var global = RED.settings.functionGlobalContext;
    var sunlight = global.sunlight;
    
    function Node(config) {
        RED.nodes.createNode(this,config);

        var node = this;

        setTimeout(updateStatus,10);

        sunlight.on('light', updateStatus);

        this.on('close', function() {
          sunlight.removeListener('light', updateStatus);
        });

        function updateStatus(data) {
          var color = (sunlight.isLight()) ? 'yellow' : 'gray';
          node.status({fill:color,shape:"dot",text:sunlight.current.primaryState});
        }
    }

    RED.nodes.registerType("current-light",Node);
};
