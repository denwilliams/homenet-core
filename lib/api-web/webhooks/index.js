var express = require('express');

function factory(services) {
  var app = express();
  
  app.use(tokenMiddleware);

  return app;
}

module.exports = exports = factory;
