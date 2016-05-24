module.exports = function(RED) {
  function IsDark(config) {
    RED.nodes.createNode(this,config);
    var node = this;
    this.on('input', function(msg) {
      var global = RED.settings.functionGlobalContext;
      if (global.sunlight.isDark()) node.send([msg,null]);
      else node.send([null,msg]);
    });
  }
  RED.nodes.registerType("isdark", IsDark);
};
