// USE STATES NOW

// var express = require('express');

// function factory(services) {
//   return createApi(services.scene);
// }

// function createApi(scene) {

//   var app = express();

//   app.get('/', function(req, res) {
//     res.send(scene.scenes);
//   });

//   app.get('/current', function(req, res) {
//     res.send(scene.current);
//   });

//   app.patch('/current', function(req, res) {
//     var id = req.body.id;
//     if (id) scene.set(req.body.id);
//     res.send(scene.current);
//   });

//   app.get('/:scene', function(req, res) {
//     var scene = req.params.scene;
//     res.send(scene.scenes[scene]);
//   });

//   return app;
// }


// module.exports = exports = factory;
