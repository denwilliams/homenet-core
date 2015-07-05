var IMPLEMENTS = 'webApi';
var INJECT = [
  'utils',
  'sensors',
  'people',
  'locks',
  'lights',
  'scene',
  'authorization'
];

var express = require('express');
var bodyParser = require('body-parser');

var v1 = require('./v1');

function factory(services) {
  var app = express();
  app.use(bodyParser.json());
  app.use('/v1', v1(services));
  return {
    app:app
  };
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;
