import express = require('express');
import _ = require('lodash');

export function create(services: Homenet.IWebDependencies) : express.Router {

  const states: Homenet.IStateManager = services.states;
  const app: express.Express = express();

  app.get('/', function(req, res) {
    Promise.all(_.map(states.getTypes(), (state, key) => {
      return state.getCurrent().then(stateId => {
        return { id: key, state: stateId, available: state.getAvailable() };
      });
    }))
    .then(items => {
      res.json(items);
    })
    .catch(err => {
    });
  });

  app.get('/:type', function(req, res) {
    const type = req.params.type;
    states.getCurrent(type)
    .then(state => res.json({ id: type, state, available: states.getAvailable(type) }))
    .catch(err => {
      res.status(400).send(err);
    });
  });

  app.put('/:type', function(req, res) {
    states.setCurrent(req.params.type, String(req.body.state))
    .then(state => {
      res.json(state);
    })
    .catch(err => {
      res.status(400).send(err);
    });
  });

  return app;
}
