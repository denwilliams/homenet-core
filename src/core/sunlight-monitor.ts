exports.monitor = monitorSun;

var SunCalc = require('suncalc');
var EventEmitter = require('events').EventEmitter;
var domain = require('domain');

var TEN_MINS = 600000;
var ONE_MIN = 60000;
var TEN_SECS = 10000;
var INTERVAL = ONE_MIN;
var FIRST_INTERVAL = TEN_SECS;

/**
 * @constructs module:sunlight.SunlightMonitor
 * @implements {EventEmitter}
 * @param  {Object} options - monitor options
 * @param {float} options.latitude - latitude of coords to monitor
 * @param {float} options.longitude - longitude of coords to monitor
 * @param {Logger} options.logger - logger instance to use
 */
function monitorSun(options) {

  // inherited from EventEmitter

  /** @method module:sunlight.SunlightMonitor#on */
  /** @method module:sunlight.SunlightMonitor#emit */
  /** @method module:sunlight.SunlightMonitor#removeListener */
  /** @method module:sunlight.SunlightMonitor#removeAllListeners */

  //  var mqtt = options.mqtt;
  var logger = options.logger;
  var latitude = options.latitude;
  var longitude = options.longitude;

  var evt = new EventEmitter();
  var state;

  if (!latitude || !longitude) {
    logger.warn('Location not provided - sunlight module disabled');
  } else {
    logger.info('Sunlight calculations based on ' + latitude + ', ' + longitude);
    logger.info('Sunlight is currently: ' + currentLight());
  }

  function init() {
    
    /**
      * Gets a value indicating the current light state - either "light" or "dark"
      * @member current
      * @memberOf module:sunlight.SunlightMonitor#
      * @readOnly
      */
    Object.defineProperty(evt, 'current', {
      get: function() {
        return { isLight: isLight(), primaryState: currentLight() };
      }
    });
    
  
    /**
    * Returns true if the monitored coordinates are currently dark
    * @method isDark
    * @memberOf module:sunlight.SunlightMonitor#
    * @returns {Boolean}
    */
    evt.isDark = isDark;
  
    /**
    * Returns true if the monitored coordinates are currently light
    * @method isLight
    * @memberOf module:sunlight.SunlightMonitor#
    * @returns {Boolean}
    */
    evt.isLight = isLight;
    
    evt.refresh = refresh;

    var d = domain.create();
    d.on('error', function(err) {
      logger.error('sunlight error', err);
    });
    d.run(function() {

      // run every ten mins
      var interval = setInterval(function() {
        refresh();
      }, INTERVAL);

      // first run in 5 secs
      setTimeout(function() {
        refresh();
      }, FIRST_INTERVAL);

    });
  }


  function refresh() {
    var newState = isDark();
    if (state != newState) {
      state = newState;
      var stateName = (state ? 'dark' : 'light');
      evt.emit('light', {value:stateName});
      //mqtt.publish('environment/light', {value: stateName});
      //mqtt.publishNotification('light',stateName,'yellow');   
    }
  }

  function isLight() {
    return !isDark();
  }

  function isDark() {
    if (!latitude || !longitude) return false;

    var now = new Date();
    var times = SunCalc.getTimes(now, latitude, longitude);
    // using goldenhour instead of sunset/sunrise as it starts to get dark then
    var pastSunrise = dateDiff(times.goldenHourEnd, now) < 0;
    var pastSunset = dateDiff(times.goldenHour, now) < 0;
    return pastSunset || (!pastSunrise);
  }

  function currentLight() {
    return isLight() ? 'light' : 'dark';
  }
  
  init();
  
  return evt;  
}

function dateDiff(d1, d2) {
  return d1.getTime() - d2.getTime();
}
