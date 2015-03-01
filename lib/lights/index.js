var IMPLEMENTS = 'lights';
var INJECT = ['logger', 'config'];

var states = require('./states');

function factory(services) {
  var config = services.config;

  var lights = {
    addType: function(typeId, type) {
      lights[typeId] = type;
    },
    setLights: setLights,
    states: states,
    ids: []
  };

  bindLights();

  return lights;

  function setLights(typeId, hubId, groupId, value) {
    lights[typeId].setLights(hubId, groupId, value);
  }

  function bindLights() {
    config.lights.forEach(function (l) {
      lights[l.id] = setLights.bind(null, l.type, l.hub, l.groupId);
      lights.ids.push(l.id);
    });
  }
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;