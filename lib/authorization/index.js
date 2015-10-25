/**
 * Authorizes a request by a token.
 * @see Authorizer
 * @module authorization
 */

var IMPLEMENTS = 'authorization';
var INJECT = ['logger', 'config'];

var Authorizer = require('./authorizer');

function factory(services) {
  var config = services.config;
  return new Authorizer(config);
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;