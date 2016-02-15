/// <reference path="../../../../../interfaces/interfaces.d.ts" />
/// <reference path="../../../../../typings/node/node.d.ts" />
/// <reference path="../../../../../typings/express/express.d.ts" />
/// <reference path="../../../../../typings/lodash/lodash.d.ts" />

import express = require('express');
import _ = require('lodash');

function factory(services: {states: IStateManager}) {
  return createApi(services.states);
}

function createApi(states: IStateManager) : express.Router {

  var app : express.Express = express();

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


export = factory;
