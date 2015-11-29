var express = require('express');

var sceneApi = require('./scene');
var lightsApi = require('./lights');
var locksApi = require('./locks');
var peopleApi = require('./people');
var sunlightApi = require('./sunlight');
var zonesApi = require('./zones');

function factory(services) {
  var app = express();
  
  var authorization = services.authorization;

  // TODO: finish token middleware
  // 
  //app.use(tokenMiddleware);

  app.use('/triggers', require('./triggers')(services));
  app.use('/commands', require('./commands')(services));
  app.use('/switches', require('./switches')(services));
  app.use('/values',   require('./values')(services));
  app.use('/states',   require('./states')(services));
  app.use('/presence', require('./presence')(services));
  app.use('/zones',    zonesApi(services));

  // app.use('/scenes',   sceneApi(services));
  // app.use('/sunlight', sunlightApi(services));
  //app.use('/sensor',  services.sensors.app);
  // app.use('/lights',  lightsApi (services));
  // app.use('/locks',   locksApi  (services));
  // app.use('/people',  peopleApi (services));

  return app;

  function tokenMiddleware(req, res, next) {
    var token = req.headers['x-api-token'] || req.query.token || null;
    req.token = token;
    if (token) {
      getUserForToken(token)
      .then(function(user) {
        req.userId = user;
        if (user == null) {
          next(new Error('Invalid token'));
        } else {
          next();
        }

      })
      .fail(function(err) {
        next(err);
      });
    } else {
      // next();
      next(new Error('No token'));
    }
  }

  function getUserForToken(token) {
    console.log(token);
    return authorization.authorize(token)
    .then(function(result) {
      return result;
    })
    .fail(function() {
      return null;
    });
  }

}

module.exports = exports = factory;
