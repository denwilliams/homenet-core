import express = require('express');
import _ = require('lodash');

export function create(services: Homenet.IWebDependencies) : express.Router {
  const classesManager = services.classesManager;

  var app : express.Router = express();

  app.get('/', (req, res) => {
    res.json(classesManager.getInstancesDetails().map(toApiInstance));
  });

  return app;
}

function toApiInstance(src) {
  if (!src) return null;
  return {
    key: src.key,
    class: src.class,
    id: src.id,
    zone: src.zone,
    switchId: src.switchId,
    commandId: src.commandId,
    commandMeta: src.commandMeta,
    valueId: src.valueId,
    name: src.name,
    expose: src.expose
  };
}
