import { createKernel } from '../inversify.testkernel';
import { create, config } from './fixtures/test-locks';
import test from 'ava';

test.beforeEach(t => {
  const kernel = createKernel();
  kernel.unbind('IConfig');
  kernel.bind<Homenet.IConfig>('IConfig').toConstantValue(config);
  const locks = kernel.get<Homenet.ILockManager>('ILockManager');
  const instanceLoader = kernel.get<Homenet.IInstanceLoader>('IInstanceLoader');
  locks.addType('test', create())
  t.context.locks = locks;
  t.context.config = config;
  t.context.instanceLoader = instanceLoader;
  t.context.kernel = kernel;
});

test('loads instances when instanceLoader#loadInstances is called', async (t) => {
  // ARRANGE
  const locks: Homenet.ILockManager = t.context.locks;
  const instanceLoader: Homenet.IInstanceLoader = t.context.instanceLoader;

  // ACT
  const lock1a = locks.getInstance('one');
  instanceLoader.loadInstances(t.context.config);
  const lock1b = locks.getInstance('one');

  // ASSERT
  t.falsy(lock1a);
  t.truthy(lock1b);
});

test('can lock with commands', async (t) => {
  // ARRANGE
  const locks: Homenet.ILockManager = t.context.locks;
  const instanceLoader: Homenet.IInstanceLoader = t.context.instanceLoader;
  instanceLoader.loadInstances(t.context.config);
  const lock1 = locks.getInstance('one');
  const commandManager: Homenet.ICommandManager = t.context.kernel.get('ICommandManager');
  t.is(lock1.get(), false);

  // ACT
  commandManager.run('lock', 'one', 'lock');

  // ASSERT
  t.is(lock1.get(), true);
});

test('can unlock with commands', async (t) => {
  // ARRANGE
  const locks: Homenet.ILockManager = t.context.locks;
  const instanceLoader: Homenet.IInstanceLoader = t.context.instanceLoader;
  instanceLoader.loadInstances(t.context.config);
  const lock1 = locks.getInstance('one');
  const commandManager: Homenet.ICommandManager = t.context.kernel.get('ICommandManager');
  lock1.set(true);
  t.is(lock1.get(), true);

  // ACT
  commandManager.run('lock', 'one', 'unlock');

  // ASSERT
  t.is(lock1.get(), false);
});

test('can lock with switch', async (t) => {
  // ARRANGE
  const locks: Homenet.ILockManager = t.context.locks;
  const instanceLoader: Homenet.IInstanceLoader = t.context.instanceLoader;
  instanceLoader.loadInstances(t.context.config);
  const lock1 = locks.getInstance('one');
  const switchManager: Homenet.ISwitchManager = t.context.kernel.get('ISwitchManager');
  t.is(lock1.get(), false);

  // ACT
  switchManager.set('lock', 'one', true);

  // ASSERT
  t.is(lock1.get(), true);
});

test('can unlock with switch', async (t) => {
  // ARRANGE
  const locks: Homenet.ILockManager = t.context.locks;
  const instanceLoader: Homenet.IInstanceLoader = t.context.instanceLoader;
  instanceLoader.loadInstances(t.context.config);
  const lock1 = locks.getInstance('one');
  lock1.set(true);
  const switchManager: Homenet.ISwitchManager = t.context.kernel.get('ISwitchManager');
  t.is(lock1.get(), true);

  // ACT
  switchManager.set('lock', 'one', false);

  // ASSERT
  t.is(lock1.get(), false);
});
