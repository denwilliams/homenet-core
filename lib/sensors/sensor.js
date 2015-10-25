var util = require('util');

exports.load = function(triggers, values) {
  /**
   * @class
   * @abstract
   * @example
   * function MySensor() {
   *   Sensor.call(this);
   * }
   * Sensor.extend(MySensor);
   */
  function Sensor(instanceId) {
    this._trigger = triggers.add('sensor', instanceId);
    this._values = values.addInstance('sensor', instanceId);
  }

  /**
   * Extends a class by inheriting Sensor.
   * IMPORTANT: must call `Sensor.call(this, id)` in the constructor.
   * @param  {function} Constructor - the constructor to extend
   */
  Sensor.extend = function(Constructor) {
    util.inherits(Constructor, Sensor);
  };

  /**
   * Triggers this sensor
   */
  Sensor.prototype.trigger = function() {
    this._trigger.trigger();
  };

  Sensor.prototype.set = function(key, value) {
    this._values.set(key, value);
  };

  Sensor.prototype.get = function(key) {
    return this._values.get(key);
  };

  Sensor.prototype.getAll = function() {
    return this._values.getAll();
  };

  return Sensor;
};
