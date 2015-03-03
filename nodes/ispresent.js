module.exports = function(RED) {
  var global = RED.settings.functionGlobalContext;
  var presence = global.presence;

  function Node(config) {

    var node = this;

    var presenceId = config.presenceId;
    
    RED.nodes.createNode(this,config);

    this.on('input', function(msg) {
      if (presence.isPresent(presenceId)) node.send([msg,null]);
      else node.send([null,msg]);
    });

  }
  RED.nodes.registerType("ispresent",Node);
};
