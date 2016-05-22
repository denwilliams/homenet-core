import express = require('express');

export function create(services: Homenet.Api.IWebDependencies) : express.Router {

  const sunlight = services.sunlight;
  const app = express();

  app.get('/', function(req, res) {
    res.send(sunlight.current);
  });

  return app;
}
