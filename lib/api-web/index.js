var IMPLEMENTS = 'webApi';
var INJECT = ['sensors'];

function factory(services) {
  var express = require('express');
  var app = express();

  app.use('/sensor', services.sensors.app);

  return app;
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;