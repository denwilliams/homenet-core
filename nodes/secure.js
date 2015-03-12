module.exports = function(RED) {
    "use strict";

    var global = RED.settings.functionGlobalContext;
    var security = global.security;

    function Node(config) {
        var self = this;

        RED.nodes.createNode(this,config);

        var node = this;

        security.on('changed', handleEvent);

        this.on('close', function() {
            security.removeListener('changed', handleEvent);
        });

        function handleEvent(isSecure) {
            var msg = {
                topic: 'secure',
                payload: isSecure
            };
            if (isSecure) {
                node.send([msg,null]);
            } else {
                node.send([null,msg]);
            }
        }
    }


    RED.nodes.registerType("secure in",Node);

};
