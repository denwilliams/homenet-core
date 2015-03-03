module.exports = function(RED) {
    'use strict';

    var global = RED.settings.functionGlobalContext;
    var locks = global.locks;

    function Node(config) {
        var self = this;

        RED.nodes.createNode(this,config);

        var lockId = config.lockId;
        var lock = config.lock;

        var node = this;

        this.on('input', function(msg) {

            // console.log('Setting lock ' + lockId, lock);
            locks[lockId](lock ? lock === 'true' ? true : false : msg.payload);

        });
    }

    RED.nodes.registerType('locks out',Node);

};
