import express = require('express');
import _ = require('lodash');

export function create(services: Homenet.IWebDependencies) : express.Router {
  return createApi(services.commands);
}

export function createApi(commands: Homenet.ICommandManager) : express.Router {

  var app = express();

  app.get('/', function (req, res) {
    res.json(_.map(commands.getAll(), (obj, id) => {
      return { id: id, commands: commands.getMeta(id) };
    }));
  });

  app.get('/:id', function (req, res) {
    var id = req.params.id;
    var meta = commands.getMeta(id);
    res.json({ id: id, commands: commands.getMeta(id) });
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
