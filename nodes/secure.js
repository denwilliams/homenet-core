module.exports = function(RED) {
    "use strict";

    var global = RED.settings.functionGlobalContext;
    var security = global.security;

    function Node(config) {
        var self = this;

        RED.nodes.createNode(this,config);

        var id = config.pid;
        
        var node = this;

        presence.on(id, handlePresence);

        this.on('close', function() {
            presence.removeListener(id, handlePresence);
        });

        function handlePresence(data) {
            var msg = {
                topic: 'presence/'+id,
                payload: data
            };
            if (data) {
                node.send([msg,null]);
            } else {
                node.send([null,msg]);
            }
        }
    }


    RED.nodes.registerType("secure in",Node);

};
