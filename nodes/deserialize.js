module.exports = function(RED) {
    function DeserializeNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.on('input', function(msg) {
            msg.payload = JSON.parse(msg.payload);
            node.send(msg);
        });
    }
    RED.nodes.registerType("deserialize",DeserializeNode);
}
