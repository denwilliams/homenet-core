// NOT USED

var states = require('./states');


/**
 * The lights module allows for controlling and managing connected lights.
 * @constructs LightManager
 */
function create(config) {

  var timers = {};
  var states = {};

  var lights = {

    /**
     * @method LightManager#addType
     * @param {string} typeId - unique idenfifier for this type
     * @param {Lighter} type - type definition for this light type
     */
    addType: function(typeId, type) {
      lights[typeId] = type;
    },
    // see docs below
    setLights: setLights,
    /**
     * @member LightManager#states
     */
    states: states,
    /**
     * @member LightManager#ids
     */
    ids: [],
    /**
     * @member LightManager#all
     */
    all: []
  };

  bindLights();

  return lights;

  // --- PRIVATE ---

  /**
   * Sets the state for hte specified lights
   * @method LightManager#setLights
   * @param {string} typeId  - the controller type id
   * @param {?string} hubId  - the hub or controller id (if defined)
   * @param {string|number} groupId - id of the group of lights
   * @param {string} value   - value or state to set the lights to
   * @param {Object} opts    - options
   */
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
      var fn = setLights.bind(null, l.type, l.hub, l.groupId);
      lights[l.id] = fn;
      lights.ids.push(l.id);
      lights.all.push({id: l.id, type:l.type, state:'unknown', set:fn});
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

exports.create = create;
