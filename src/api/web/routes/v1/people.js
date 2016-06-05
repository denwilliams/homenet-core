// REMOVED
// 
// var express = require('express');

// function factory(services) {
//   return createApi(services.people, services.presence);
// }

// function createApi(people, presence) {

//   var app = express();

//   app.get('/', function(req, res) {
//     res.send(people.all);
//   });

//   app.get('/me', function(req, res) {
//     getPersonRequest(req.userId);
//   });

//   app.patch('/me', function(req, res) {
//     patchPersonRequest(res, req.userId, req.body);
//   });

//   app.get('/:id', function(req, res) {
//     getPersonRequest(res, req.params.id);
//   });

//   app.patch('/:id', function(req, res) {
//     patchPersonRequest(res, req.params.id, req.body);
//   });

//   return app;

//   function getPersonRequest(res, id) {
//     var person = getPerson(id);
//     res.send(person);
//   }

//   function patchPersonRequest(res, id, patch) {
//     var presence = patch.presence;
//     var person = getPerson(id);
//     if (presence && person) {
//       var p = presence.get('person:'+id);
//       if (p[presence]) {
//         p[presence]();
//       }
//     }
//     res.send(person);
//   }

//   function getPerson(id) {
//     return people[id];
//   }
// }

// module.exports = exports = factory;
