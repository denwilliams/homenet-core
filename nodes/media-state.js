var NAME = 'media-state';

module.exports = function(RED) {
  var global = RED.settings.functionGlobalContext;
  var media = global.media;

  function Node(config) {
    RED.nodes.createNode(this,config);

    var node = this;
    var deviceId = config.deviceId;

    media.on('stateChanged', check);

    this.on('close', function() {
      media.removeListener('stateChanged', check);
    });

    function check(data) {
      if (deviceId && data.id !== deviceId) return;

      msg = { payload: state, topic:'media/'+state.id };

      if (state.activePlayer) node.send([msg,null]);
      else node.send([null,msg]);
    }
  }
  RED.nodes.registerType(NAME, Node);
};
