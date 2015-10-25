var express = require('express');

function factory(services) {
  return createApi(services.lights);
}

function createApi(lights) {

  var app = express();
  
  app.get('/', function(req, res) {
    res.send(); //lights.all);
  });

  app.patch('/:id', function(req, res) {
    // var id = req.body.id;
    // if (id) scene.set(req.body.id);
    // res.send(scene.current);
  });

  app.get('/:id', function(req, res) {
    var scene = req.params.scene;
    res.send(scene.scenes[scene]);
  });

  return app;
}


module.exports = exports = factory;
