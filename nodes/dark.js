var name = 'dark';

module.exports = function(RED) {
  var global = RED.settings.functionGlobalContext;
  var sunlight = global.services.get('ISunlight');

  function Node(n) {
    RED.nodes.createNode(this,n);

    var node = this;

    sunlight.on('light', check);

    this.on('close', function() {
      sunlight.removeListener('light', check);
    });

    function check(data) {
      var isTrue = (data.value === name);

      msg = { payload: isTrue, topic:name };

      if (isTrue) node.send([msg,null]);
      else node.send([null,msg]);
    }
  }
  RED.nodes.registerType(name,Node);
};
