module.exports = function(RED) {
  function Node(config) {
    var notifications = RED.settings.functionGlobalContext.notifications;

    RED.nodes.createNode(this,config);

    var node = this;

    this.on('input', function(msg) {
      notifications.send('alert', msg.payload);
    });

  }
  RED.nodes.registerType("notify", Node);
};
