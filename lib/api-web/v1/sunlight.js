var express = require('express');

function factory(services) {
  return createApi(services.sunlight);
}

function createApi(sunlight) {

  var app = express();

  app.get('/', function(req, res) {
    res.send(sunlight.current);
  });

  return app;
}

module.exports = exports = factory;
