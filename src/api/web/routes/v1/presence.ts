import express = require('express');
import _ = require('lodash');

export function create(services: Homenet.IWebDependencies) : express.Router {
  return createApi(services.presence);
}

function createApi(presence: Homenet.IPresenceManager) : express.Router {
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
