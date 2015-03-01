module.exports = function(RED) {
    function Node(config) {
        RED.nodes.createNode(this,config);
        this.from = config.from;
        this.to = config.to;

        var node = this;

        var node = this;
        this.on('input', function(msg) {
            var d = new Date();
            var hour = d.getHours();
            var mins = d.getMinutes();

            if (hour >= node.from && hour <= node.to) {
                node.send([msg,null]);
            } else {
                node.send([null,msg]);
            }
        });
    }
    RED.nodes.registerType("timeofday",Node);
}
