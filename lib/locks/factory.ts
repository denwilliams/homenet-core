/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../interfaces/interfaces.d.ts" />


var http = require('http');
var EventEmitter = require('events').EventEmitter;
var express = require('express');
var bodyParser = require('body-parser');

/**
 * @enum {LockState}
 * @type {string}
 */
var states = {
  /**
   * Unknown state
   */
  UNKNOWN: 'unknown'
};

/**
 * Manaages and controls connected locks
 * @constructs LockManager
 */
function create(config : any, logger : Logger) : LockManager {
  var locks = {};

  var service = {

    /**
     * Adds a new lock type
     * @method LockManager#addType
     * @param {string} typeId - unique identifier for this type
     * @param {Locker} type - lock implementation
     */
    addType: function(typeId, type) {
      service[typeId] = type;
    },

    /**
     * @method LockManager#setLock
     * @param {string} typeId       - unique ID for this type
     * @param {string} [controllerId] - ID of the specific controller for this type (if any)
     * @param {string} lockId       - ID of this lock
     * @param {string} state        - state to set this lock: lock or unlock
     */
    setLock: setLock,

    /**
     * All lock IDs registered
     * @member {Array<string>} LockManager#ids
     */
    ids: [],

    /**
     * All locks
     * @member {Array<Lock>} LockManager#all
     */
    all: [],

    /**
     * @method LockManager#get
     * @param {string} typeId - lock controller type id
     */
    get: function(typeId) {
      return locks[typeId];
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

      /**
       * Represents a single lock managed by the {@link LockManager}
       * @class Lock
       */
      var lockObj = {

        /**
         * The unique ID of this lock
         * @member {string} Lock#id
         */
        id: id,

        /**
         * The type of lock
         * @member {string} Lock#type
         */
        type: l.type,

        /**
         * Sets a new state for this lock
         * @method Lock#set
         * @param {string} state - the state to set to: lock or unlock
         */
        set: set,

        /**
         * The type of lock
         * @member {LockState} Lock#state
         */
        state: 'unknown'
      };

      service.ids.push(id);
      service[id] = set;
      locks[id] = lockObj;

      service.all.push(lockObj);

    });
  }
}

exports.create = create;

/**
 * Controls locks of a specific type
 * @interface Locker
 */
/**
 * Returns the type id this locker manages
 * @method Locker#getType
 * @returns {string} the type id
 */
/**
 * Sets the state of a lock (locks or unlocks)
 * @method Locker#setLock
 * @param {string} [controllerId] - id of the controller the lock is connected to (if any)
 * @param {string|integer} lockId - unique id of the lock
 * @param {string} state          - state to set the lock to: lock or unlock
 */
