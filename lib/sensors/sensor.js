var util = require('util');
var DEFAULT_TIMEOUT = 60000;

exports.load = function(triggers, presence, values) {
  /**
   * @class Sensor
   * @abstract
   * @param {string} instanceId - unique ID of this instance
   * @param {Object}      [opts] - options
   * @param {SensorMode}  [opts.mode='toggle'] - trigger|toggle|value.
   *                                 Toggle based sensors are set `true`/`false`.
   *                                 Trigger based sensors are `true` when triggered until a timeout period expires where they become `false`.
   * @param {integer}     [opts.timeout] - timeout period in milliseconds for trigger based sensors.
   * @param {string}      [opts.zone] - the ID of any zone this sensor is a child of
   * @example
   * function MySensor(id) {
   *   Sensor.call(this, id, {mode:'trigger'});
   * }
   * Sensor.extend(MySensor);
   *
   * var sensor = new MySensor(1);
   * sensor.trigger();
   */
  function Sensor(instanceId, opts) {
    opts = opts || {};
    this.id = instanceId;
    var mode = this.mode = opts.mode || 'toggle';

    if (mode === 'trigger' || mode === 'toggle') {
      var timeout = opts.timeout || DEFAULT_TIMEOUT;
      var parentId = opts.zone ? 'zone.'+opts.zone : null;
      var sensorPresence = this._presence = presence.add('sensor.'+instanceId, {timeout:timeout, category:'sensor', parent:parentId});
    }
    
    if (mode === 'trigger') {
      var trigger = this._trigger = triggers.add('sensor', instanceId);
      trigger.onTrigger(function() {
        sensorPresence.bump();
      });
    } else if (mode === 'value') {
      this._values = values.addInstance('sensor', instanceId);
    }
  }

  /**
   * Extends a class by inheriting Sensor.
   * IMPORTANT: must call `Sensor.call(this, id, triggerBased)` in the constructor.
   * @param  {function} Constructor - the constructor to extend
   */
  Sensor.extend = function(Constructor) {
    util.inherits(Constructor, Sensor);
  };

  /**
   * Triggers this sensor
   */
  Sensor.prototype.trigger = function() {
    if (!this._trigger) return;
    this._trigger.trigger();
  };

  Sensor.prototype.on = function() {
    if (!this._presence) return;
    this._presence.set();
  };

  Sensor.prototype.off = function() {
    if (!this._presence) return;
    this._presence.clear();
  };

  Sensor.prototype.set = function(key, value) {
    if (!this._values) return;
    this._values.set(key, value);
  };

  Sensor.prototype.get = function(key) {
    if (!this._values) return;
    return this._values.get(key);
  };

  Sensor.prototype.getAll = function() {
    return this._values.getAll();
  };

  return Sensor;
};
