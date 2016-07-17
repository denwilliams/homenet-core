import { createKernel } from '../inversify.testkernel';
import test from 'ava';
import * as sinon from 'sinon';

test.beforeEach(t => {
  const kernel = createKernel();
  t.context.kernel = kernel;
  t.context.valuesManager = kernel.get<Homenet.IValuesManager>('IValuesManager');
});

test('#addInstance adds a new instance and returns it', t => {
  // ARRANGE
  const valuesManager: Homenet.IValuesManager = t.context.valuesManager;

  // ACT
  const instance = valuesManager.addInstance('test', '1');

  // ASSERT
  t.truthy(instance);
});

test('#getInstance returns an added instance', t => {
  // ARRANGE
  const valuesManager: Homenet.IValuesManager = t.context.valuesManager;
  const instance = valuesManager.addInstance('test', '1');

  // ACT
  const instanceGot = valuesManager.getInstance('test', '1');

  // ASSERT
  t.is(instanceGot, instance);
});

test('#getInstance returns null if no instance', t => {
  // ARRANGE
  const valuesManager: Homenet.IValuesManager = t.context.valuesManager;

  // ACT
  const instanceGot = valuesManager.getInstance('test', '1');

  // ASSERT
  t.is(instanceGot, null);
});

test('#set sets a value on the instance', async (t) => {
  // ARRANGE
  const valuesManager: Homenet.IValuesManager = t.context.valuesManager;
  const instance = valuesManager.addInstance('test', '1');
  await instance.waitReady();

  // ACT
  valuesManager.set('test', '1', 'key1', 1);
  valuesManager.set('test', '1', 'key2', 'two');

  // ASSERT
  t.is(instance.get('key1'), 1);
  t.is(instance.get('key2'), 'two');
});

test('#get gets a value on the instance', async (t) => {
  // ARRANGE
  const valuesManager: Homenet.IValuesManager = t.context.valuesManager;
  const instance = valuesManager.addInstance('test', '1');
  await instance.waitReady();
  valuesManager.set('test', '1', 'key1', 1);
  valuesManager.set('test', '1', 'key2', 'two');

  // ACT
  const key1 = instance.get('key1');
  const key2 = instance.get('key2');

  // ASSERT
  t.is(key1, 1);
  t.is(key2, 'two');
});

test('#set or instance#set persists the value', async (t) => {
  // ARRANGE
  const valuesManager: Homenet.IValuesManager = t.context.valuesManager;
  const persistence: Homenet.IPersistence = t.context.kernel.get('IPersistence');
  const instance = valuesManager.addInstance('test', '1');
  await instance.waitReady();

  // ACT
  valuesManager.set('test', '1', 'key1', 1);
  instance.set('key2', 'two');

  // ASSERT
  const values = await persistence.get('value.test.1');
  t.is(values.key1, 1);
  t.is(values.key2, 'two');
});

test('#set or instance#set emits an event', async (t) => {
  // ARRANGE
  const spy1 = sinon.spy();
  const spy2 = sinon.spy();
  const spyAll = sinon.spy();
  const valuesManager: Homenet.IValuesManager = t.context.valuesManager;
  const eventBus: Homenet.IEventBus = t.context.kernel.get('IEventBus');
  const instance = valuesManager.addInstance('test', '1');
  eventBus.on('value.test.1', 'key1', spy1);
  eventBus.on('value.test.1', 'key2', spy2);
  eventBus.on('value.test.1', '*', spyAll);
  await instance.waitReady();

  // ACT
  valuesManager.set('test', '1', 'key1', 1);
  instance.set('key2', 'two');

  // ASSERT
  t.true(spy1.calledOnce);
  t.true(spy2.calledOnce);
  t.true(spyAll.calledTwice);
  t.deepEqual(spy1.getCalls()[0].args[0], {name: 'value.test.1.key1', data: 1});
});
