var express = require('express');
var _ = require('lodash');

function factory (services) {
  return createApi(services.switches);
}

module.exports = exports = factory;

function createApi(switches) {

  var app = express();

  app.get('/', function (req, res) {
    var all = _.mapValues(
      switches.getAll(),
      function(sw) { return sw.get(); }
    );
    res.json(all);
  });

  app.get('/:id', function (req, res) {
    var id = req.params.id;
    res.json(mapSwitch(switches.get(id)));
  });

  app.put('/:id', function (req, res) {
    var id = req.params.id;
    var sw = switches.get(id);
    sw.set(req.body);
    res.json(mapSwitch(sw));
  });

  return app;
}

function mapSwitch(s) {
  return s.get();
}
