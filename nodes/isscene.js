module.exports = function(RED) {

  function Node(config) {

    var node = this;

    RED.nodes.createNode(this,config);

    var id = config.sceneId;
    var scene = RED.settings.functionGlobalContext.scene;

    this.on('input', function(msg) {
      
      var currScene = scene.currentId;

      if (currScene === id) node.send([msg,null]);
      else node.send([null,msg]);

    });

  }

  RED.nodes.registerType("isscene",Node);

};
