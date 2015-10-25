var express = require('express');
var _ = require('lodash');

function factory(services) {
  return createApi(services.zone);
}

function createApi(zone) {

  var app = express();

  app.get('/', function(req, res) {
    res.json(_.map(zone.getAll(), toApiZone));
  });

  app.get('/:id', function(req, res) {
    var id = req.params.id;
    res.json(toApiZone(zone.get(id)));
  });

  return app;
}

function toApiZone(zone) {
  return {
    id: zone.id,
    name: zone.name,
    faIcon: zone.faIcon,
    presence: zone.presence,
    parent: zone.parentId
  };
}


module.exports = exports = factory;
