var Q = require('q');

module.exports = exports = function(broadcast, services) {
  var weather = services['weather'];

  var current = {
    temperature: {
      current: 0,
      min: 0,
      max: 0
    },
    humidity: 0,
    pressure: 0,
    conditions: '',
    description: '',
    rain: false,
    wind: {
      speed: 0,
      direction:0
    },
    clouds: 0
  };
  var today = {};
  var tomorrow = {};

  // weather.on('conditions', function(conditions) {
  //   current.conditions = conditions.value;
  //   broadcastCurrent();
  // });

  // weather.on('weather', function(weather) {
  //   current.temperature.current = weather.temp;
  //   current.temperature.min = weather.temp_min;
  //   current.temperature.max = weather.temp_max;
  //   current.wind.speed = weather.wind.speed;
  //   current.wind.direction = weather.wind.deg;
  //   current.humidity = weather.humidity;
  //   current.pressure = weather.pressure;
  //   current.conditions = weather.name;
  //   current.description = weather.description;
  //   current.rain = weather.name === 'Rain';
  //   current.clouds = weather.clouds.all;
  //   broadcastCurrent();
  // });

  function broadcastCurrent() {
    broadcast('currentUpdated', current);
  }

  return {
    getCurrent: function() {
      return Q.when(current);
    },
    getToday: function() {
      return Q.when(today);
    },
    getTomorrow: function() {
      return Q.when(tomorrow);
    }
  };
};
