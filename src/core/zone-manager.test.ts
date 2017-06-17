import { createKernel } from '../inversify.testkernel';
import test from 'ava';
import * as sinon from 'sinon';

const config: Homenet.IConfig = {
  zones: [
    {
      id: 'simple',
      name: 'Simple',
      parent: null,
      timeout: 0
    },
    {
      id: 'parent',
      name: 'Parent',
      parent: null,
      timeout: 0
    },
    {
      id: 'child',
      name: 'Child',
      parent: 'parent',
      timeout: 0
    },
    {
      id: 'simple-timeout',
      name: 'Simple Timeout',
      parent: null,
      timeout: 60000
    },
    {
      id: 'parent-timeout',
      name: 'Parent Timeout',
      parent: null,
      timeout: 0
    },
    {
      id: 'child-timeout',
      name: 'Child Timeout',
      parent: 'parent-timeout',
      timeout: 60000
    }
  ]
};

test.beforeEach(t => {
  const kernel = createKernel();
  kernel.unbind('IConfig');
  kernel.bind<Homenet.IConfig>('IConfig').toConstantValue(config);
  t.context.kernel = kernel;
});

test('#getAll returns all zones defined in config', (t) => {
  // ARRANGE
  const zoneManager: Homenet.IZoneManager = t.context.kernel.get('IZoneManager');;

  // ACT
  const zones = zoneManager.getAll();

  // ASSERT
  t.is(zones.length, 6);
});

test('#get returns a single zone defined in config', (t) => {
  // ARRANGE
  const zoneManager: Homenet.IZoneManager = t.context.kernel.get('IZoneManager');;

  // ACT
  const zone = zoneManager.get('simple');

  // ASSERT
  t.truthy(zone);
  t.is(zone.id, 'simple');
});

test('#get returns a null if zone NOT defined in config', (t) => {
  // ARRANGE
  const zoneManager: Homenet.IZoneManager = t.context.kernel.get('IZoneManager');;

  // ACT
  const zone = zoneManager.get('fake');

  // ASSERT
  t.is(zone, null);
});

test('#getMap returns a dictionary of zones defined in config', (t) => {
  // ARRANGE
  const zoneManager: Homenet.IZoneManager = t.context.kernel.get('IZoneManager');;

  // ACT
  const zones = zoneManager.getMap();

  // ASSERT
  t.truthy(zones);
  t.truthy(zones['simple']);
  t.is(zones['simple'].id, 'simple');
});

test('each zone creates a presence instance', (t) => {
  // ARRANGE
  const presence: Homenet.IPresenceManager = t.context.kernel.get('IPresenceManager');
  const spy = sinon.spy(presence, 'add');
  const zoneManager: Homenet.IZoneManager = t.context.kernel.get('IZoneManager');

  // ACT
  const zone = zoneManager.get('simple');

  // ASSERT
  t.true(spy.called);
  t.is(spy.callCount, 6);
  t.truthy(presence.get('zone.simple'));
});
