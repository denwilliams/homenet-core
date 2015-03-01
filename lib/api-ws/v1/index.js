module.exports = exports = function(broadcast, services, config) {
  var apiBindings = [];

  function loadApi() {
    loadModule('weather', './weather');
    loadModule('scene', './scenes');
    // loadModule('sensor', './sensors');
    // loadModule('environment', './environment');
    loadModule('people', './people');
    loadModule('zone', './zones');
    // loadModule('stats', './stats');
  }

  function loadModule(moduleName, modulePath) {
    var module = require(modulePath)(broadcast.bind(broadcast, moduleName), services, config);

    for (var eventName in module) {
      apiBindings.push({
        event: moduleName + ':' + eventName,
        handler: module[eventName]
      });
    }
  }

  function bindApi(socket) {
    apiBindings.forEach(function(binding) {
      console.log('Binding API handler for ' + binding.event);
      socket.on(binding.event, cbToQ(binding.handler, binding.event));
    });
  }

  function cbToQ(fn, event) {
    return function(data, cb) {
      console.log('got event: ' + event, data);
      fn(data)
        .then(function(res) { console.log('response for : ' + event, res); cb(res); })
        .fail(function(err) { cb(err); });
    };
  }

  loadApi();

  return {
    '_loadApi': loadApi,
    'bindApi': bindApi
  };
};
