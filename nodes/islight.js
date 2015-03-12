module.exports = function(RED) {
  function IsLight(config) {
    RED.nodes.createNode(this,config);
    var node = this;
    this.on('input', function(msg) {
      var global = RED.settings.functionGlobalContext;
      if (global.sunlight.isLight()) node.send([msg,null]);
      else node.send([null,msg]);
    });
  }
  RED.nodes.registerType("islight",IsLight);
};
