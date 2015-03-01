var name = 'light';

module.exports = function(RED) {
  var global = RED.settings.functionGlobalContext;
  var sunlight = global.sunlight;

  function Node(n) {
    RED.nodes.createNode(this,n);

    var node = this;

    sunlight.on('light', check);

    this.on('close', function() {
      sunlight.removeListener('light', check);
    });

    function check(data) {
      if (data.value !== name) return;

      msg = { payload: {}, topic:name };
      node.send(msg);
    }
  }
  RED.nodes.registerType(name,Node);
};
