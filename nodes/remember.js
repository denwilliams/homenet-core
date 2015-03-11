module.exports = function(RED) {
    function Node(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.on('input', function(msg) {
        	console.log(RED.settings);
	        var global = RED.settings.functionGlobalContext;
            global.brain = global.brain || {};
        	var payload = 
        		(typeof msg.payload === 'string') ?
        			JSON.parse(msg.payload) :
        			msg.payload;
        	global.brain[msg.topic] = payload;
            node.send(msg);
        });
    }
    RED.nodes.registerType("remember", Node);
}
