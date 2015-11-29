var IMPLEMENTS = 'webApi';
var INJECT = [
  'utils',
  'logger',
  'config',
  'triggers',
  'switches',
  'commands',
  'states',

  'sunlight',
  'sensors',
  // 'people',
  'presence',
  'locks',
  'lights',
  'scene',
  'zone',
  'authorization'
];

var express = require('express');
var bodyParser = require('body-parser');

var v1 = require('./v1');
var geohopper = require('./geohopper');
var webhooks = require('./webhooks');

function factory(services) {
  var app = express();
  app.use(bodyParser.json({strict: false}));
  app.use('/geohopper', geohopper(services));
  app.use('/v1', v1(services));
  return {
    app:app
  };
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;
