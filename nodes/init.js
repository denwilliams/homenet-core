module.exports = function(RED) {
    function Node(n) {
        RED.nodes.createNode(this,n);

        var node = this;

        // send a message 500ms after init
        var t = setTimeout(init, 500);

        this.on('close', function() {
            clearTimeout(t);
        });

        function init() {
            var global = RED.settings.functionGlobalContext;
            var msg = {
                topic: 'init',
                payload: global.scene.current
            };
            console.log('init');
            node.send(msg);
        }
    }
    RED.nodes.registerType("init",Node);
};
