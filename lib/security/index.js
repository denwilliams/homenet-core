var IMPLEMENTS = 'security';
var INJECT = ['logger', 'eventBus'];

function factory(services) {
  var eventBus = services.eventBus;
  var isSecure = false;

  var result = {
    secure: setSecure.bind(null, true),
    unsecure: setSecure.bind(null, false)
  };

  Object.defineProperty(result, 'isSecure' , function() {
    return isSecure;
  });

  function setSecure(secure) {
    isSecure = secure;
    eventBus.emit('security', 'changed', secure);
  }
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;