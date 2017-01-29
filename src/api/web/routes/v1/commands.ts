import express = require('express');
import _ = require('lodash');

export function create(services: Homenet.IWebDependencies) : express.Router {
  return createApi(services.commands);
}

export function createApi(commands: Homenet.ICommandManager) : express.Router {

  const app = express();

  app.get('/', function (req, res) {
    res.json(_.map(commands.getAll(), (obj, id) => {
      return { id: id, commands: commands.getMeta(id) };
    }));
  });

  app.get('/:id', function (req, res) {
    const id = req.params.id;
    const meta = commands.getMeta(id);
    res.json({ id: id, commands: commands.getMeta(id) });
  });

  app.get('/:id/:cmd', function (req, res) {
    const id = req.params.id;
    const cmd = req.params.cmd;
    const meta = commands.getMeta(id);
    res.json(meta && meta[cmd]);
  });

  app.post('/:id/:cmd', function (req, res) {
    const id = req.params.id;
    const cmd = req.params.cmd;
    const instance = commands.getInstance(id);
    const command = instance[cmd].bind(instance);

    Promise.resolve(command(req.body))
    .then(result => res.json(result))
    .catch(err => res.status(400).json(err));
  });

  return app;
}
