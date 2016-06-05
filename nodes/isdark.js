module.exports = function(RED) {
  function IsDark(config) {
    RED.nodes.createNode(this,config);
    var node = this;
    var global = RED.settings.functionGlobalContext;
    var sunlight = global.services.get('ISunlight');

    this.on('input', function(msg) {
      if (sunlight.isDark()) node.send([msg,null]);
      else node.send([null,msg]);
    });
  }
  RED.nodes.registerType("isdark", IsDark);
};
