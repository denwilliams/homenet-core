var IMPLEMENTS = 'locks';
var INJECT = ['logger', 'config'];

var http = require('http');
var EventEmitter = require('events').EventEmitter;

function factory(services) {
  var config = services.config;
  var logger = services.logger.getLogger('locks');

  var service = {
    addType: function(typeId, type) {
      service[typeId] = type;
    },
    setLock: setLock,
    ids: []
  };

  bindLocks();

  return service;

  function setLock(typeId, controllerId, lockId, value) {
    console.log(typeId, controllerId, lockId, value);
    console.log(service);
    service[typeId].setLock(controllerId, lockId, value);
  }

  function bindLocks() {
    config.locks.forEach(function (l) {
      service[l.id] = setLock.bind(null, l.type, l.controller, l.lockId);
      service.ids.push(l.id);
    });
  }
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;