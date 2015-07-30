var express = require('express');

var sceneApi = require('./scene');
var lightsApi = require('./lights');
var locksApi = require('./locks');
var peopleApi = require('./people');

function factory(services) {
  var app = express();
  
  var authorization = services.authorization;

  // TODO: finish token middleware
  // 
  app.use(tokenMiddleware);

  app.use('/sensor',  services.sensors.app);
  app.use('/scene',   sceneApi  (services));
  app.use('/lights',  lightsApi (services));
  app.use('/locks',   locksApi  (services));
  app.use('/people',  peopleApi (services));

  return app;

  function tokenMiddleware(req, res, next) {
    var token = req.headers['x-api-token'] || req.query.token || null;
    req.token = token;
    if (token) {
      getUserForToken(token)
      .then(function(user) {
        req.user = user;
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
    return authorization.authorize(token)
    .then(function(result) {
      return (result) ? {id:'authorized'} : null;
    });
  }

}

module.exports = exports = factory;
