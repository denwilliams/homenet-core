var IMPLEMENTS = 'security';
var INJECT = ['logger', 'eventBus', 'presence'];

var EventEmitter = require('events').EventEmitter;

function factory(services) {
  var eventBus = services.eventBus;
  var isSecure = false;
  var service, result;
  var logger = services.logger.getLogger('security');

  services.presence.on('person:any', function(present) {
    setSecure(!present);
  });

  service = result = new EventEmitter();
  result.secure = setSecure.bind(null, true);
  result.unsecure = setSecure.bind(null, false);

  Object.defineProperty(result, 'isSecure' , function() {
    return isSecure;
  });

  return result;

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