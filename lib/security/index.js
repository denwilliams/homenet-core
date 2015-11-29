var IMPLEMENTS = 'security';
var INJECT = ['logger', 'eventBus', 'presence', 'states'];

var EventEmitter = require('events').EventEmitter;

function factory(services) {
  var eventBus = services.eventBus;
  var states = services.states;
  var presence = services.presence;

  var logger = services.logger.getLogger(IMPLEMENTS);

  logger.info('Starting '+IMPLEMENTS+' module');

  // TODO: persist state for restarts
  var isSecure = false;
  var service;

  presence.on('person.any', function(present) {
    setSecure(!present);
  });

  service = new EventEmitter();
  service.secure = setSecure.bind(null, true);
  service.unsecure = setSecure.bind(null, false);

  Object.defineProperty(service, 'isSecure' , {
    get: function() { return isSecure; }
  });

  states.addType('secure', {
    getCurrent: function() {
      logger.info('secure.getCurrent ' + service.isSecure);
      return service.isSecure; }
  });


  return service;

  function setSecure(secure) {
    isSecure = secure;
    logger.info('Security changed: ' + secure);
    service.emit('changed', secure);
    eventBus.emit('security', 'changed', secure);
  }
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;