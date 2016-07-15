import { createKernel, IKernel } from '../inversify.testkernel';
import test from 'ava';
import { factory, config } from './fixtures/test-sensors';
import { EventEmitter } from 'events';

test.beforeEach(t => {
  const kernel = createKernel();
  t.context.kernel = kernel;
  const sensorManager = kernel.get<Homenet.ISensorManager>('ISensorManager');
  sensorManager.addType('test', factory);
  kernel.unbind('IConfig');
  kernel.bind<Homenet.IConfig>('IConfig').toConstantValue(config);
  const instanceLoader = kernel.get<Homenet.IInstanceLoader>('IInstanceLoader');
  t.context.sensorManager = sensorManager;
  t.context.triggers = kernel.get<Homenet.ITriggerManager>('ITriggerManager');
  t.context.values = kernel.get<Homenet.IValuesManager>('IValuesManager');

  return instanceLoader.loadInstances(config);
});

test('emitting trigger updates trigger instance', (t) => {
  // ARRANGE
  const sensorManager:  Homenet.ISensorManager = t.context.sensorManager;
  const triggers:  Homenet.ITriggerManager = t.context.triggers;
  const sensor: EventEmitter = <any> (sensorManager.getInstance('motion'));
  const trigger: Homenet.ITrigger = triggers.get('sensor', 'motion');
  t.is(trigger.lastTriggered, null);

  // ACT
  sensor.emit('trigger');

  // ASSERT
  t.not(trigger.lastTriggered, null);
});

test('emitting value updates values instance', async (t) => {
  // ARRANGE
  const sensorManager:  Homenet.ISensorManager = t.context.sensorManager;
  const values:  Homenet.IValuesManager = t.context.values;
  const sensor: EventEmitter = <any> (sensorManager.getInstance('temperature'));
  const valueStore: Homenet.IValueStore = values.getInstance('sensor', 'temperature');
  await valueStore.waitReady();

  // ACT
  sensor.emit('value', 'temperature', '25C');

  // ASSERT
  t.is(valueStore.get('temperature'), '25C');
});

test.skip('toggle', async (t) => {
  t.fail();
});

test.skip('presence trigger', async (t) => {
  t.fail();
});

test.skip('presence toggle', async (t) => {
  t.fail();
});
