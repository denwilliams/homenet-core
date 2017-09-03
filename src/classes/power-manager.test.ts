import { PowerManager } from './power-manager';
import { createKernel } from '../inversify.testkernel';
import { create, config } from './fixtures/test-power';
import test from 'ava';

test.beforeEach(t => {
  const kernel = createKernel();
  kernel.unbind('IConfig');
  kernel.bind<Homenet.IConfig>('IConfig').toConstantValue(config);
  const powerManager = kernel.get<Homenet.IPowerManager>('IPowerManager');
  const instanceLoader = kernel.get<Homenet.IInstanceLoader>('IInstanceLoader');
  powerManager.addSettableType('test', create())
  t.context.powerManager = powerManager;
  t.context.config = config;
  t.context.instanceLoader = instanceLoader;
  t.context.kernel = kernel;
});

test('loads instances when instanceLoader#loadInstances is called', async (t) => {
  // ARRANGE
  const powerManager: Homenet.IPowerManager = t.context.powerManager;
  const instanceLoader: Homenet.IInstanceLoader = t.context.instanceLoader;

  // ACT
  const power1 = powerManager.getInstance('one');
  instanceLoader.loadInstances(t.context.config);
  const power2 = powerManager.getInstance('one');

  // ASSERT
  t.falsy(power1);
  t.truthy(power2);
});

test('can turn on with commands', async (t) => {
  // ARRANGE
  const powerManager: Homenet.IPowerManager = t.context.powerManager;
  const instanceLoader: Homenet.IInstanceLoader = t.context.instanceLoader;
  instanceLoader.loadInstances(t.context.config);
  const power1 = powerManager.getInstance('one');
  const commandManager: Homenet.ICommandManager = t.context.kernel.get('ICommandManager');
  if (!power1) throw Error('power1 not found');
  t.is(power1.get(), 'unknown');

  // ACT
  commandManager.run('power.one', 'turnOn');

  // ASSERT
  t.is(power1.get(), 'on');
});

test('can turn off with commands', async (t) => {
  // ARRANGE
  const powerManager: Homenet.IPowerManager = t.context.powerManager;
  const instanceLoader: Homenet.IInstanceLoader = t.context.instanceLoader;
  instanceLoader.loadInstances(t.context.config);
  const power1 = powerManager.getInstance('one');
  const commandManager: Homenet.ICommandManager = t.context.kernel.get('ICommandManager');
  if (!power1) throw Error('power1 not found');
  t.is(power1.get(), 'unknown');

  // ACT
  commandManager.run('power.one', 'turnOff');

  // ASSERT
  t.is(power1.get(), 'off');
});

test('can turn on with switch', async (t) => {
  // ARRANGE
  const powerManager: Homenet.IPowerManager = t.context.powerManager;
  const instanceLoader: Homenet.IInstanceLoader = t.context.instanceLoader;
  instanceLoader.loadInstances(t.context.config);
  const power1 = powerManager.getInstance('one');
  const switchManaager: Homenet.ISwitchManager = t.context.kernel.get('ISwitchManager');
  if (!power1) throw Error('power1 not found');
  t.is(power1.get(), 'unknown');

  // ACT
  switchManaager.set('power.one', 'on');

  // ASSERT
  t.is(power1.get(), 'on');
});

test('can turn off with switch', async (t) => {
  // ARRANGE
  const powerManager: Homenet.IPowerManager = t.context.powerManager;
  const instanceLoader: Homenet.IInstanceLoader = t.context.instanceLoader;
  instanceLoader.loadInstances(t.context.config);
  const power1 = powerManager.getInstance('one');
  const switchManaager: Homenet.ISwitchManager = t.context.kernel.get('ISwitchManager');
  if (!power1) throw Error('power1 not found');
  t.is(power1.get(), 'unknown');

  // ACT
  switchManaager.set('power.one', 'off');

  // ASSERT
  t.is(power1.get(), 'off');
});
