module.exports = function(RED) {
  "use strict";

  var global = RED.settings.functionGlobalContext;
  
  function Node(config) {
    RED.nodes.createNode(this,config);

    var node = this;

    var presence = global.presence;
    var eventBus = global.eventBus;

    var id = config.presenceId;

    setTimeout(updateStatus, 10);

    presence.on(id, updateStatus);

    this.on('close', function() {
      presence.removeListener(id, updateStatus);
    });

    function updateStatus() {
      var p = presence.get(id);
      var color = 'red';
      var text = 'NOT FOUND';

      if (p) {
        if (p.isPresent) {
          color = 'green';
          text = 'present';
        } else {
          color = 'gray';
          text = 'away';
        }
        node.status({fill:'blue',shape:"dot",text:p.isPresent});
      }
      node.status({fill:color,shape:'dot',text:text});
    }
  }

  RED.nodes.registerType("current-presence",Node);
};
