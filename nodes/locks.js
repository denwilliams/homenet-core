module.exports = function(RED) {
    'use strict';

    var global = RED.settings.functionGlobalContext;
    var switches = global.switches;

    function Node(config) {
        RED.nodes.createNode(this,config);

        var lockId = config.lockId;
        var defaultState = config.lock;

        this.on('input', function(msg) {
            var state = defaultState || msg.payload;
            state = state === 'true' ? true : false;
            switches.set('lock', lockId, state);
        });
    }

    RED.nodes.registerType('locks out',Node);

};
