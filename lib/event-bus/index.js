var IMPLEMENTS = 'eventBus';
var INJECT = ['logger'];

function factory(services) {
  var EventEmitter = require('events').EventEmitter;
  var e = new EventEmitter();

  return {
    emit: function(source, event, data) {
      var name = eventName(source, event);
      // console.log('Listeners:', name, e.listeners(name));
      e.emit(name, data);
    },
    on: function(source, event, cb) {
      var name = eventName(source, event);
      e.on(name, cb);
      // console.log('Listeners:', name, e.listeners(name));
    },
    removeListener: function(source, event, registeredCb) {
      var name = eventName(source, event);
      e.removeListener(name, registeredCb);
      // console.log('Listeners:', name, e.listeners(name));
    }
  };
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;

function eventName(source, event) {
  return source + '-' + event;
}