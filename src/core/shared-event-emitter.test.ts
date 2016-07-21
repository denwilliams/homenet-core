import { createKernel } from '../inversify.testkernel';

import test from 'ava';

test.beforeEach(t => {
  const kernel = createKernel();
  t.context.kernel = kernel;
  t.context.eventBus = kernel.get('IEventBus');
});

test('on receives emitted event with name and data', t => {
  // ARRANGE
  t.plan(2);
  const eventBus: Homenet.IEventBus = t.context.eventBus;
  eventBus.on('test', 'something', assertReceived);

  // ACT
  eventBus.emit('test', 'something', { a: 1 })

  // ASSERT
  function assertReceived(e) {
    t.is(e.name, 'test.something');
    t.deepEqual(e.data, { a: 1 })
  }
});

test('on can use wildcard for event', t => {
  // ARRANGE
  t.plan(2);
  const eventBus: Homenet.IEventBus = t.context.eventBus;
  eventBus.on('test', '*', assertReceived);

  // ACT
  eventBus.emit('test', 'something', { a: 1 })

  // ASSERT
  function assertReceived(e) {
    t.is(e.name, 'test.something');
    t.deepEqual(e.data, { a: 1 })
  }
});

test('on can use wildcard for source', t => {
  // ARRANGE
  t.plan(2);
  const eventBus: Homenet.IEventBus = t.context.eventBus;
  eventBus.on('*', 'something', assertReceived);

  // ACT
  eventBus.emit('test', 'something', { a: 1 })

  // ASSERT
  function assertReceived(e) {
    t.is(e.name, 'test.something');
    t.deepEqual(e.data, { a: 1 })
  }
});

test('on can use wildcard within event', t => {
  // ARRANGE
  t.plan(2);
  const eventBus: Homenet.IEventBus = t.context.eventBus;
  eventBus.on('*', 'something.*', assertReceived);

  // ACT
  eventBus.emit('test', 'something.blah', { a: 1 })

  // ASSERT
  function assertReceived(e) {
    t.is(e.name, 'test.something.blah');
    t.deepEqual(e.data, { a: 1 })
  }
});
