var express = require('express');

function factory(services) {
  var app = express();
  
  return app;
}

module.exports = exports = factory;
