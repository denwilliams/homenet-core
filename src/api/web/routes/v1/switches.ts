import express = require('express');
import _ = require('lodash');

export function create(services: Homenet.IWebDependencies): express.Router {
  return createApi(services.switches);
}

function createApi(switches: Homenet.ISwitchManager) {

  var app = express();

  app.get('/', function (req, res) {
    var all = _.map(
      switches.getAllInstances(),
      (sw, key) => mapSwitch(sw, key)
    );
    res.json(all);
  });

  app.get('/:id', function (req, res) {
    var id = req.params.id;
    var sw = switches.getInstance(id);
    res.json(mapSwitch(sw, id));
  });

  app.put('/:id', function (req, res) {
    var id = req.params.id;
    var sw = switches.getInstance(id);
    sw.set(req.body.value);
    res.json(mapSwitch(sw, id));
  });

  return app;
}

function mapSwitch(sw, id) {
  return {id, value: sw.get()};
}
