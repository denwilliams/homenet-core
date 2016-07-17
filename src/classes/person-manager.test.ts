import { createKernel } from '../inversify.testkernel';
import test from 'ava';
import { config } from './fixtures/test-people';
import { EventEmitter } from 'events';

test.beforeEach(t => {
  const kernel = createKernel();
  kernel.unbind('IConfig');
  kernel.bind<Homenet.IConfig>('IConfig').toConstantValue(config);
  const personManager = kernel.get<Homenet.IPersonManager>('IPersonManager');

  t.context.kernel = kernel;
  t.context.personManager = personManager;
  t.context.presence = kernel.get<Homenet.IPresenceManager>('IPresenceManager');
});

test('#get returns a person by their ID', (t) => {
  // ARRANGE
  const personManager: Homenet.IPersonManager = t.context.personManager;

  // ACT
  const person = personManager.get('john');

  // ASSERT
  t.truthy(person);
  t.is(person.name, 'John Tester');
});

test('#get returns null for invalid ID', (t) => {
  // ARRANGE
  const personManager: Homenet.IPersonManager = t.context.personManager;

  // ACT
  const person = personManager.get('noone');

  // ASSERT
  t.is(person, null);
});

test('a person has an associated presence item', (t) => {
  // ARRANGE
  const personManager: Homenet.IPersonManager = t.context.personManager;
  const presence: Homenet.IPresenceManager = t.context.presence;
  const person = personManager.get('john');
  const personPresence = presence.get('person.john');

  // ACT
  person.set(true);

  // ASSERT
  t.true(person.presence);
  t.true(personPresence.isPresent);
});

test('anyone presence toggled by presence of anyone', t => {
  // ARRANGE
  const personManager: Homenet.IPersonManager = t.context.personManager;
  const presence: Homenet.IPresenceManager = t.context.presence;
  const person = personManager.get('john');
  const anyonePresence = presence.get('person.any');
  t.false(anyonePresence.isPresent);

  // ACT
  person.set(true);

  // ASSERT
  t.true(person.presence);
  t.true(anyonePresence.isPresent);
});
