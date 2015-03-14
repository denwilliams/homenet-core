var IMPLEMENTS = 'webApi';
var INJECT = ['sensors', 'people'];

function factory(services) {
  var express = require('express');
  var app = express();

  // TODO: token middleware

  app.use('/sensor', services.sensors.app);
  app.use('/people', services.people.app);

  return app;
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;