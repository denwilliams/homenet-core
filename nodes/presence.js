module.exports = function(RED) {
    "use strict";

    var global = RED.settings.functionGlobalContext;
    var presence = global.presence;

    function NodeIn(config) {
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

    function NodeOut(config) {
        var self = this;

        RED.nodes.createNode(this,config);

        var id = config.pid;
        
        var node = this;

        this.on("input", function(msg) {
            var p = presence.get(id);
            if (p) {
                if (msg.payload === 'true') p.set();
                else p.clear();
            }
        });
    }

    RED.nodes.registerType("presence out",NodeOut);
    RED.nodes.registerType("presence in",NodeIn);

};
