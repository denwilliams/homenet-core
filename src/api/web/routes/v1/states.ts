import express = require('express');
import _ = require('lodash');

export function create(services: Homenet.Api.IWebDependencies) : express.Router {

  const states: IStateManager = services.states;
  const app: express.Express = express();

  app.get('/', function(req, res) {
    res.json(_.mapValues(states.getTypes(), function(state) {
      return state.getCurrent();
    }));
  });

  app.get('/:type', function(req, res) {
    res.json(states.getCurrent(req.params.type));
  });

  app.put('/:type', function(req, res) {
    states.setCurrent(req.params.type, req.body);
    res.json(states.getCurrent(req.params.type));
  });

  return app;
}
