var util = require('util');

exports.load = function() {
  /**
   * @class
   * @abstract
   */
  function Power(instanceId) {}


  /**
   * Extends a class by inheriting Power.
   * IMPORTANT: must call `Power.call(this, id)` in the constructor.
   * @param  {function} Constructor - the constructor to extend
   */
  Power.extend = function(Constructor) {
    util.inherits(Constructor, Power);
  };


  /**
   * @abstract
   */
  Power.prototype.set = function(value) {
    console.log('SETTING POWER STATE: ' + value);
  };

  /**
   * @abstract
   */
  Power.prototype.get = function() {};

  return Power;
};
