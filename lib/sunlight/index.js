var IMPLEMENTS = 'sunlight';
var INJECT = ['logger', 'config'];

// var hours = 3600000;
var TEN_MINS = 600000;
var ONE_MIN = 60000;
var TEN_SECS = 10000;
var INTERVAL = ONE_MIN;
var FIRST_INTERVAL = TEN_SECS;


function factory(services) {
  var logger = services.logger.getLogger('sunlight');
  var config = services.config;
  return monitorSun({
    logger: logger, 
    latitude: config.location.latitude, 
    longitude: config.location.longitude
  });
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;




var SunCalc = require('suncalc');
var EventEmitter = require('events').EventEmitter;
var domain = require('domain');

// var latitude = -37.8136111;
// var longitude = 144.9630556;

function monitorSun(options) {
//  var mqtt = options.mqtt;
  var logger = options.logger;
  var latitude = options.latitude;
  var longitude = options.longitude;

  logger.debug('Sunlight calc working from ' + latitude + ', ' + longitude);
  logger.debug('Sunlight is currently: ' + currentLight());

  var evt = new EventEmitter();

  var state;

  evt.isDark = isDark;
  evt.isLight = isLight;
  Object.defineProperty(evt, 'current', { get: currentLight });

  init();

  return evt;

  function init() {
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
}

function dateDiff(d1, d2) {
  return d1.getTime() - d2.getTime();
}
