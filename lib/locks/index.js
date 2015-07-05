var IMPLEMENTS = 'locks';
var INJECT = ['logger', 'config'];

var http = require('http');
var EventEmitter = require('events').EventEmitter;
var express = require('express');
var bodyParser = require('body-parser');

function factory(services) {
  var config = services.config;
  var logger = services.logger.getLogger('locks');

  var locks = {};

  var service = {
    addType: function(typeId, type) {
      service[typeId] = type;
    },
    setLock: setLock,
    ids: [],
    all: [],
    get: function(id) {
      return locks[id];
    }
  };

  bindLocks();

  return service;

  function setLock(typeId, controllerId, lockId, value) {
    service[typeId].setLock(controllerId, lockId, value);
  }

  function bindLocks() {
    config.locks.forEach(function (l) {
      var id = l.id;

      var set = setLock.bind(null, l.type, l.controller, l.lockId);
      var lockObj = {
        id: id,
        type: l.type,
        set: set,
        state: 'unknown'
      };

      service.ids.push(id);
      service[id] = set;
      locks[id] = lockObj;

      service.all.push(lockObj);

    });
  }
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;