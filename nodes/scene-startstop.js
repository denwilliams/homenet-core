module.exports = function(RED) {

    var global = RED.settings.functionGlobalContext;
    var scene = global.scene;

    function NodeStart(n) {
        RED.nodes.createNode(this,n);

        var node = this;

        // send a message 500ms after init
        var t = setTimeout(init, 500);

        this.on('close', function() {
            clearTimeout(t);
        });

        function init() {
            var msg = {
                topic: 'scene/start',
                payload: scene.current
            };
            node.send(msg);
        }
    }

    function NodeStop(n) {
        RED.nodes.createNode(this,n);

        var node = this;


        scene.onChanged(init);

        var currScene = scene.current;

        this.on('close', function() {
            scene.removeOnChanged(init);
        });

        function init() {
            var msg = {
                topic: 'scene/stop',
                payload: currScene
            };
            node.send(msg);
            
            // don't fire again
            scene.removeOnChanged(init);
        }
    }

    RED.nodes.registerType("scene start",NodeStart);
    RED.nodes.registerType("scene stop",NodeStop);
};
