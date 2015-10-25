module.exports = function(RED) {
    "use strict";

    var global = RED.settings.functionGlobalContext;
    var eventBus = global.eventBus;

    function NodeIn(config) {
        var self = this;

        RED.nodes.createNode(this, config);

        var evt = config.eid;
        
        var node = this;

        eventBus.on(evt, null, handleEvent);

        this.on('close', function() {
            eventBus.removeListener(evt, null, handleEvent);
        });

        function handleEvent(e) {
            console.log('GOT EVENT ',e);
            node.send({
                topic: 'event/'+e.name,
                payload: e.data
            });
        }
    }

    RED.nodes.registerType("appevent in", NodeIn);

};
