import { createKernel } from '../inversify.testkernel';
import test from 'ava';
import * as sinon from 'sinon';

test.beforeEach(t => {
  const kernel = createKernel();
  t.context.triggerManager = kernel.get<Homenet.ITriggerManager>('ITriggerManager');
});

test('#add creates and returns a trigger', (t) => {
  // ARRANGE
  const triggerManager: Homenet.ITriggerManager = t.context.triggerManager;

  // ACT
  const trigger = triggerManager.add('test', '1');

  // ASSERT
  t.truthy(trigger);
});

test('#trigger updates last trigger time', (t) => {
  // ARRANGE
  const triggerManager: Homenet.ITriggerManager = t.context.triggerManager;
  const trigger = triggerManager.add('test', '1');
  t.is(trigger.lastTriggered, null);

  // ACT
  trigger.trigger();

  // ASSERT
  t.not(trigger.lastTriggered, null);
});

test('#trigger fires event, #onTrigger listens for event', (t) => {
  // ARRANGE
  const triggerManager: Homenet.ITriggerManager = t.context.triggerManager;
  const trigger = triggerManager.add('test', '1');
  const spy1 = sinon.spy();
  const spy2 = sinon.spy();
  trigger.onTrigger(spy1);
  triggerManager.onTrigger('test', '1', spy2);

  // ACT
  // 2 ways to trigger
  trigger.trigger(true);
  triggerManager.trigger('test', '1', true);

  // ASSERT
  t.true(spy1.calledTwice);
  t.true(spy2.calledTwice);
});

test('Trigger#removeTrigger un-listens for event', (t) => {
  // ARRANGE
  const triggerManager: Homenet.ITriggerManager = t.context.triggerManager;
  const trigger = triggerManager.add('test', '1');
  const spy1 = sinon.spy();
  trigger.onTrigger(spy1);
  trigger.removeOnTriggerListener(spy1);

  // ACT
  trigger.trigger(true);

  // ASSERT
  t.false(spy1.called);
});
