var IMPLEMENTS = 'utils';
var INJECT = ['logger', 'config', 'eventBus', 'notifications', 'storage'];

function factory(services) {
  return services;
}

factory.$inject = INJECT;
factory.$implement = IMPLEMENTS;
module.exports = exports = factory;
