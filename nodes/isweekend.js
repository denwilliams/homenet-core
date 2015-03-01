module.exports = function(RED) {
    function Node(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.on('input', function(msg) {
            var day = (new Date()).getDay();
            var isWeekend = (day == 6) || (day == 0);
            if (isWeekend) node.send(msg);
        });
    }
    RED.nodes.registerType("isweekend",Node);
}
