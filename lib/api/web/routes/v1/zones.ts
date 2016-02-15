/// <reference path="../../../../../interfaces/interfaces.d.ts" />
/// <reference path="../../../../../typings/lodash/lodash.d.ts"/>

import WebApiDependencies = require('../../dependencies');

import express = require('express');
import _ = require('lodash');

export function create(services: WebApiDependencies) : express.Router {
  const zone = services.zones;

  var app : express.Router = express();

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
