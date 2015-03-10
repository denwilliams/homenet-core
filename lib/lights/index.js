var IMPLEMENTS = 'lights';
var INJECT = ['logger', 'config'];

var states = require('./states');

function factory(services) {
  
  var config = services.config;
  var timers = {};
  var states = {};

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

  // --- PRIVATE ---

  function setLights(typeId, hubId, groupId, value, opts) {
    opts = opts || {};

    var key = typeId+':'+hubId+':'+groupId;
    var oldState = states[key] || 'off';
    var oldTimer = timers[key];

    if (!conditionsMet(opts.conditions, key)) {
      return;
    }

    if (oldTimer) {
      clearTimeout(oldTimer);
      delete timers[key];
    }

    if (opts.duration) {
      timers[key] = setTimeout(function() {
        setLights(typeId, hubId, groupId, oldState);
      }, opts.duration);
    } else {
      states[key] = value;
    }

    lights[typeId].setLights(hubId, groupId, value);
  }

  function bindLights() {
    config.lights.forEach(function (l) {
      lights[l.id] = setLights.bind(null, l.type, l.hub, l.groupId);
      lights.ids.push(l.id);
    });
  }

  function conditionsMet(conditions, key) {
    if (!conditions) return true;

    var fail = false;
    if (conditions.state) {
      switch (condition.state) {
        case 'off':
          fail = fail || (states[key] === 'off');
          break;
        case 'on':
          fail = fail || (states[key] !== 'off');
          break;
      }
    }
    return !fail;
  }
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;