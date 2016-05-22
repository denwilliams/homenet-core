import express = require('express');

export function create(services) : express.Router {
  return createApi(services.triggers);
}

function createApi(triggers) {

  var app = express();

  app.get('/', function (req, res) {
    var all = triggers.getAll().map(mapTrigger);
    res.send(all);
  });

  app.get('/:id', function (req, res) {
    var id = req.params.id;
    res.send(mapTrigger(triggers.get(id)));
  });

  app.post('/:id', function (req, res) {
    var id = req.params.id;
    var trigger = triggers.get(id);
    trigger.trigger();
    res.send(mapTrigger(trigger));
  });

  return app;
}

function mapTrigger(trigger) {
  return {
    id: trigger.id,
    lastTriggered: trigger.lastTriggered
  };
}
