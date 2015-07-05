var IMPLEMENTS = 'api';
var INJECT = ['webApi', 'wsApi', 'authorization'];

function factory(services) {
  return services;
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;