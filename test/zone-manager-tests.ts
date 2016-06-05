/// <reference path="../typings/mocha/mocha.d.ts"/>
/// <reference path="../interfaces/interfaces.d.ts"/>
import assert = require('assert');
import {EventEmitter} from 'events';

import ZoneManagerImpl = require('../lib/core/zone-manager');
import PresenceManagerImpl = require('../lib/core/presence-manager');
import SharedEventEmitter = require('../lib/core/shared-event-emitter');

import NullLogger = require('./helper/null-logger');
import config = require('./helper/test-config');

const logger : ILogger = new NullLogger();
const eventBus : IEventBus = new SharedEventEmitter(logger);
const pm : IPresenceManager = new PresenceManagerImpl(eventBus, logger);

describe('ZoneManager', () => {
    var zm : IZoneManager;

    beforeEach(function () {
      zm = new ZoneManagerImpl(pm, config, logger);
    });

    describe('#getAll', () => {

      it('should get an array of zones', () => {
        assert(config.zones.length > 0);
        var result : IZone[] = zm.getAll();
        assert.equal(result.length, config.zones.length);
      });

    });

    describe('#get', () => {

      it('should return a zone by its id', () => {
        const id = 'kitchen';

        var result : IZone = zm.get(id);
        assert.ok(result);
        assert.equal(result.id, id);
        assert.equal(result.name, 'Kitchen');
      });

    });

    describe('#getMap', () => {

      it('should get an map of zones', () => {
        assert(config.zones.length > 0);

        const result : Dict<IZone> = zm.getMap();
        const id = 'kitchen';
        const zone : IZone = result[id];

        assert.ok(result);
        assert.ok(zone);
        assert.equal(zone.id, id);
        assert.equal(zone.name, 'Kitchen');
      });

    });
});
