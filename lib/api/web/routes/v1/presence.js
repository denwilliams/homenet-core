var express = require('express');
var _ = require('lodash');

function factory (services) {
  return createApi(services.presence);
}

module.exports = exports = factory;


function createApi(presence) {

  var app = express();

  app.get('/', function (req, res) {
    res.json(presence.getAll().map(mapPresence));
  });

  app.get('/:id', function (req, res) {
    var id = req.params.id;
    res.json(mapPresence(presence.get(id)));
  });

  return app;
}

function mapPresence(p) {
  return {
    id: p.id,
    present: p.isPresent
  };
}
