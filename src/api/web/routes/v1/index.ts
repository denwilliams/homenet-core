import express  = require('express');
import WebApiDependencies = require('../../../dependencies');
import triggers = require('./triggers');
import zones = require('./zones');
import states = require('./states');
import values = require('./values');
import switches = require('./switches');
import presence = require('./presence');
import commands = require('./commands');
import instances = require('./instances');

export function createRouter(services: Homenet.IWebDependencies) {
  const app = express();

  var authorization = services.authorization;

  // TODO: finish token middleware
  //app.use(tokenMiddleware);

  app.use('/triggers',  triggers.create(services));
  app.use('/zones',     zones.create(services));
  app.use('/commands',  commands.create(services));
  app.use('/switches',  switches.create(services));
  app.use('/values',    values.create(services));
  app.use('/states',    states.create(services));
  app.use('/presence',  presence.create(services));
  app.use('/instances', instances.create(services));

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
      next(new Error('No token'));
    }
  }

  function getUserForToken(token) {
    return authorization.authorize(token)
    .then(function(result) {
      return result;
    })
    .fail(function() {
      return null;
    });
  }

}
