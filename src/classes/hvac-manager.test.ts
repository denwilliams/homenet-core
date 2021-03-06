import { HvacManager } from './hvac-manager';
import { createKernel } from '../inversify.testkernel';
import { create, config } from './fixtures/test-hvac';
import test from 'ava';

test.beforeEach(t => {
  const kernel = createKernel();
  kernel.unbind('IConfig');
  kernel.bind<Homenet.IConfig>('IConfig').toConstantValue(config);
  const hvacManager = kernel.get<Homenet.IHvacManager>('IHvacManager');
  const instanceLoader = kernel.get<Homenet.IInstanceLoader>('IInstanceLoader');
  hvacManager.addSettableType('test', create())
  t.context.hvacManager = hvacManager;
  t.context.config = config;
  t.context.instanceLoader = instanceLoader;
  t.context.kernel = kernel;
});

test('loads instances when instanceLoader#loadInstances is called', async (t) => {
  // ARRANGE
  const hvacManager: Homenet.IHvacManager = t.context.hvacManager;
  const instanceLoader: Homenet.IInstanceLoader = t.context.instanceLoader;

  // ACT
  const hvac1 = hvacManager.getInstance('one');
  instanceLoader.loadInstances(t.context.config);
  const hvac2 = hvacManager.getInstance('one');

  // ASSERT
  t.falsy(hvac1);
  t.truthy(hvac2);
});

test('can turn on with commands', async (t) => {
  // ARRANGE
  const hvacManager: Homenet.IHvacManager = t.context.hvacManager;
  const instanceLoader: Homenet.IInstanceLoader = t.context.instanceLoader;
  instanceLoader.loadInstances(t.context.config);
  const hvac1 = hvacManager.getInstance('one');
  const commandManager: Homenet.ICommandManager = t.context.kernel.get('ICommandManager');
  if (!hvac1) throw Error('hvac1 not found');
  t.is(hvac1.get(), 'unknown');

  // ACT
  commandManager.run('hvac.one', 'turnOn');

  // ASSERT
  t.is(hvac1.get(), 'on');
});

test('can turn off with commands', async (t) => {
  // ARRANGE
  const hvacManager: Homenet.IHvacManager = t.context.hvacManager;
  const instanceLoader: Homenet.IInstanceLoader = t.context.instanceLoader;
  instanceLoader.loadInstances(t.context.config);
  const hvac1 = hvacManager.getInstance('one');
  const commandManager: Homenet.ICommandManager = t.context.kernel.get('ICommandManager');
  if (!hvac1) throw Error('hvac1 not found');
  t.is(hvac1.get(), 'unknown');

  // ACT
  commandManager.run('hvac.one', 'turnOff');

  // ASSERT
  t.is(hvac1.get(), 'off');
});

test('can turn on with switch', async (t) => {
  // ARRANGE
  const hvacManager: Homenet.IHvacManager = t.context.hvacManager;
  const instanceLoader: Homenet.IInstanceLoader = t.context.instanceLoader;
  instanceLoader.loadInstances(t.context.config);
  const hvac1 = hvacManager.getInstance('one');
  const switchManaager: Homenet.ISwitchManager = t.context.kernel.get('ISwitchManager');
  if (!hvac1) throw Error('hvac1 not found');
  t.is(hvac1.get(), 'unknown');

  // ACT
  switchManaager.set('hvac.one', 'on');

  // ASSERT
  t.is(hvac1.get(), 'on');
});

test('can turn off with switch', async (t) => {
  // ARRANGE
  const hvacManager: Homenet.IHvacManager = t.context.hvacManager;
  const instanceLoader: Homenet.IInstanceLoader = t.context.instanceLoader;
  instanceLoader.loadInstances(t.context.config);
  const hvac1 = hvacManager.getInstance('one');
  const switchManaager: Homenet.ISwitchManager = t.context.kernel.get('ISwitchManager');
  if (!hvac1) throw Error('hvac1 not found');
  t.is(hvac1.get(), 'unknown');

  // ACT
  switchManaager.set('hvac.one', 'off');

  // ASSERT
  t.is(hvac1.get(), 'off');
});
