var express = require('express');
var _ = require('lodash');

function factory (services) {
  return createApi(services.commands);
}

module.exports = exports = factory;


function createApi(commands) {

  var app = express();

  app.get('/', function (req, res) {
    res.json(_.mapValues(commands.getAll(), function(obj, id) {
      return commands.getMeta(id);
    }));
  });

  app.get('/:id', function (req, res) {
    var id = req.params.id;
    var meta = commands.getMeta(id);
    res.json(meta);
  });

  app.get('/:id/:cmd', function (req, res) {
    var id = req.params.id;
    var cmd = req.params.cmd;
    var meta = commands.getMeta(id);
    res.json(meta && meta[cmd]);
  });

  app.post('/:id/:cmd', function (req, res) {
    var id = req.params.id;
    var cmd = req.params.cmd;
    var instance = commands.getInstance(id);
    var command = instance[cmd];
    var response = command(req.body);
    res.json(response);
  });

  return app;
}

// function mapSwitch(s) {
//   return s.get();
// }
