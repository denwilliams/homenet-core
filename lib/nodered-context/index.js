var IMPLEMENTS = 'nodeRedContext';
var INJECT = ['logger', 'sunlight', 'lights', 'locks', 'scene', 'eventBus', 'presence', 'sensors', 'notifications', 'media'];

function factory(services) {
  return services;
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;
