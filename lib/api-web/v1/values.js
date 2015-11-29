var express = require('express');
var _ = require('lodash');

function factory(services) {
  return createApi(services.values);
}

function createApi(values) {

  var app = express();

  app.get('/', function(req, res) {
    // res.json(_.mapValues(states.getTypes(), function(state) {
    //   return state.getCurrent();
    // }));
  });

  app.get('/:type', function(req, res) {
    // res.json(states.getCurrent(req.params.type));
  });


  return app;
}


module.exports = exports = factory;
