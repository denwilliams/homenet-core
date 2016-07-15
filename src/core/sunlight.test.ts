import { createKernel, IKernel } from '../inversify.testkernel';

import test from 'ava';
import * as sinon from 'sinon';

const melbourne: Homenet.IConfigCoords = {
  latitude: -37.8163,
  longitude: 144.9642,
};

const newyork: Homenet.IConfigCoords = {
  latitude: 40.7128,
  longitude: 74.0059,
};

const london: Homenet.IConfigCoords = {
  latitude: 0.1278,
  longitude: 51.5074,
};

class TestConfig implements Homenet.IConfig {
  public location: Homenet.IConfigCoords;
}

test.beforeEach(t => {
  const kernel = createKernel();
  t.context.clock = sinon.useFakeTimers(0); // 1970, January 1
  kernel.unbind('IConfig');
  const config = new TestConfig();
  config.location = melbourne;
  kernel.bind('IConfig').toConstantValue(config);

  t.context.kernel = kernel;
  t.context.config = config;
});

test.afterEach(t => {
  t.context.clock.restore();
});

test('melboure was light at epoch 0', t => {
  // ARRANGE
  const config: TestConfig = t.context.config;
  const kernel: IKernel = t.context.kernel;
  const sunlight = kernel.get<Homenet.ISunlight>('ISunlight');

  // ACT
  const light = sunlight.isLight();

  // ASSERT
  t.true(light);
});

test('new york was dark at epoch 0', t => {
  // ARRANGE
  const config: TestConfig = t.context.config;
  t.context.config.location = newyork;
  const kernel: IKernel = t.context.kernel;
  const sunlight = kernel.get<Homenet.ISunlight>('ISunlight');

  // ACT
  const light = sunlight.isLight();

  // ASSERT
  t.false(light);
});

test('london was dark at epoch 0', t => {
  // ARRANGE
  const config: TestConfig = t.context.config;
  t.context.config.location = london;
  const kernel: IKernel = t.context.kernel;
  const sunlight = kernel.get<Homenet.ISunlight>('ISunlight');

  // ACT
  const light = sunlight.isLight();

  // ASSERT
  t.false(light);
});

test('#isDark is the opposite of #isLight', t => {
  // ARRANGE
  const config: TestConfig = t.context.config;
  const kernel: IKernel = t.context.kernel;
  const sunlight = kernel.get<Homenet.ISunlight>('ISunlight');

  // ACT
  const light = sunlight.isLight();
  const dark = sunlight.isDark();

  // ASSERT
  t.true(light);
  t.false(dark);
});

test('#currentLight returns the current light state', t => {
  // ARRANGE
  const config: TestConfig = t.context.config;
  const kernel: IKernel = t.context.kernel;
  const sunlight = kernel.get<Homenet.ISunlight>('ISunlight');

  // ACT
  const current = sunlight.currentLight();

  // ASSERT
  t.is(current, 'light');
});

test('#current returns the current light state', t => {
  // ARRANGE
  const config: TestConfig = t.context.config;
  const kernel: IKernel = t.context.kernel;
  const sunlight = kernel.get<Homenet.ISunlight>('ISunlight');

  // ACT
  const current = sunlight.currentLight();

  // ASSERT
  t.is(current, 'light');
});

test('provides state through stateManager as sunlight', async (t) => {
  // ARRANGE
  const kernel: IKernel = t.context.kernel;
  const sunlight = kernel.get<Homenet.ISunlight>('ISunlight');
  const stateManager = kernel.get<Homenet.IStateManager>('IStateManager');

  // ACT
  const sunlightState = await stateManager.getCurrent('sunlight');

  // ASSERT
  t.is(sunlightState, 'light');
});

test('publishes state events through stateManager as sunlight', async (t) => {
  // ARRANGE
  t.plan(3);
  const kernel: IKernel = t.context.kernel;
  const sunlight = kernel.get<Homenet.ISunlight>('ISunlight');
  const eventBus = kernel.get<Homenet.IEventBus>('IEventBus');
  t.context.clock.tick(300000); // jump forward 5m to bypass start event
  t.is(sunlight.current, 'light');
  eventBus.on('state.sunlight', 'changed', assertEvent);

  // ACT
  t.context.clock.tick(43200000); // jump forward 12h

  // ASSERT
  function assertEvent(e: {name: string, data: string}) {
    t.is(e.name, 'state.sunlight.changed');
    t.is(e.data, 'dark');
  }
});

test('fires event when light state changes', (t) => {
  // ARRANGE
  t.plan(2);
  const kernel: IKernel = t.context.kernel;
  const sunlight = kernel.get<Homenet.ISunlight>('ISunlight');
  t.context.clock.tick(300000); // jump forward 5m to bypass start event
  sunlight.on('light', assertEvent);
  t.is(sunlight.current, 'light');

  // ACT
  t.context.clock.tick(43200000); // jump forward 12h

  // ASSERT
  function assertEvent(e) {
    t.is(e, 'dark');
  }
});
