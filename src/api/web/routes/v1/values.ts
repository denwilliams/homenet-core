import express = require('express');
import _ = require('lodash');

export function create(services: Homenet.IWebDependencies) : express.Router {
  return createApi(services.values);
}

function createApi(values: Homenet.IValuesManager) {
  var app = express();

  app.get('/', function(req, res) {
    const instances = (req.query.type) ?
      values.getInstances(req.params.type) :
      values.getAllInstances();

    res.json(instances.map((value: Homenet.IValueStore) => {
      return {id: value.id, values: value.getAll()};
    }));
  });

  app.get('/:id', function(req, res) {
    const value = values.getInstance(req.params.id);
    if (value === null) res.json(null);
    else res.json({id: value.id, values: value.getAll()});
  });

  return app;
}
