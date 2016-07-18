import { createKernel } from '../inversify.testkernel';
import test from 'ava';
import * as sinon from 'sinon';

test.beforeEach(t => {
  const kernel = createKernel();
  const presence = kernel.get<Homenet.IPresenceManager>('IPresenceManager');
  t.context.kernel = kernel;
  t.context.presence = presence;
  t.context.clock = sinon.useFakeTimers(0); // 1970, January 1
});

test.afterEach(t => {
  t.context.clock.restore();
});

test('presence available via #isPresent', (t) => {
  // ARRANGE
  const presence: Homenet.IPresenceManager = t.context.presence;
  presence.add('a.b', { category: 'test' });

  // ACT
  const isPresent1a = presence.isPresent('a.b');
  const isPresent1b = presence.get('a.b').isPresent; // other way to check
  presence.get('a.b').set();
  const isPresent2a = presence.isPresent('a.b');
  const isPresent2b = presence.get('a.b').isPresent;

  // ASSERT
  t.false(isPresent1a);
  t.false(isPresent1a);
  t.true(isPresent2a);
  t.true(isPresent2a);
});

test('presence is off by default', (t) => {
  // ARRANGE
  const presence: Homenet.IPresenceManager = t.context.presence;
  presence.add('a.b', { category: 'test' });

  // ACT
  const isPresent = presence.isPresent('a.b');

  // ASSERT
  t.false(isPresent);
});

test('presence can be turned on', (t) => {
  // ARRANGE
  const presence: Homenet.IPresenceManager = t.context.presence;
  presence.add('a.b', { category: 'test' });
  t.false(presence.isPresent('a.b'));

  // ACT
  presence.get('a.b').set();

  // ASSERT
  t.true(presence.isPresent('a.b'));
});

test('presence can be turned off', (t) => {
  // ARRANGE
  const presence: Homenet.IPresenceManager = t.context.presence;
  presence.add('a.b', { category: 'test' });
  presence.get('a.b').set();
  t.true(presence.isPresent('a.b'));

  // ACT
  presence.get('a.b').clear();

  // ASSERT
  t.false(presence.isPresent('a.b'));
  t.false(presence.get('a.b').isPresent); // other way to check
});

test('presence can be bumped', (t) => {
  // ARRANGE
  const presence: Homenet.IPresenceManager = t.context.presence;
  presence.add('a.b', { category: 'test', timeout: 60000 }); // 60s timeout

  // ACT
  presence.get('a.b').bump();
  const presenceNow = presence.isPresent('a.b');
  t.context.clock.tick(30000); // jump forward 30s
  presence.bump('a.b');        // the other way to bump
  t.context.clock.tick(40000); // jump forward another 40s, past the 60s marker
  const presence70s = presence.isPresent('a.b');
  t.context.clock.tick(40000); // jump forward another 30s, past the 1:30 marker
  const presence100s = presence.isPresent('a.b');

  // ASSERT
  t.true(presenceNow);
  t.true(presence70s);
  t.false(presence100s);
});

test('presence parents are present if 1 or more children are present', (t) => {
  // ARRANGE
  const presence: Homenet.IPresenceManager = t.context.presence;
  presence.add('parent.1', { category: 'test' });
  presence.add('child.1', { category: 'test', parent: 'parent.1' });
  presence.add('child.2', { category: 'test' });
  presence.addParent('child.2', 'parent.1'); // alternative way to add parent
  t.false(presence.isPresent('parent.1'));

  // ACT
  presence.get('child.1').set();
  const up1 = presence.isPresent('parent.1');
  presence.get('child.2').set();
  const up2 = presence.isPresent('parent.1');
  presence.get('child.1').clear();
  const down1 = presence.isPresent('parent.1');
  presence.get('child.2').clear();
  const down2 = presence.isPresent('parent.1');

  // ASSERT
  t.true(up1);
  t.true(up2);
  t.true(down1);
  t.false(down2);
});

test('presence parents also work with bumped presence', (t) => {
  // ARRANGE
  const presence: Homenet.IPresenceManager = t.context.presence;
  presence.add('parent.1', { category: 'test' });
  presence.add('child.1', { category: 'test', parent: 'parent.1', timeout: 60000 });
  presence.add('child.2', { category: 'test', parent: 'parent.1' });
  t.false(presence.isPresent('parent.1'));

  // ACT
  presence.get('child.1').set();
  const up1 = presence.isPresent('parent.1');
  presence.get('child.2').bump();
  const up2 = presence.isPresent('parent.1');
  presence.get('child.1').clear();
  const down1 = presence.isPresent('parent.1');
  t.context.clock.tick(61000); // jump forward 61s
  const down2 = presence.isPresent('parent.1');

  // ASSERT
  t.true(up1);
  t.true(up2);
  t.true(down1);
  t.false(down2);
});

test('presence parents can be removed', (t) => {
  // ARRANGE
  const presence: Homenet.IPresenceManager = t.context.presence;
  presence.add('parent.1', { category: 'test' });
  presence.add('child.1', { category: 'test', parent: 'parent.1' });
  presence.removeParent('child.1', 'parent.1');
  t.false(presence.isPresent('parent.1'));

  // ACT
  presence.get('child.1').set();
  const up1 = presence.isPresent('parent.1');
  presence.get('child.1').clear();
  const down1 = presence.isPresent('parent.1');

  // ASSERT
  t.false(up1);
  t.false(down1);
});

test('#getAll returns an array of all presence items', (t) => {
  // ARRANGE
  const presence: Homenet.IPresenceManager = t.context.presence;
  presence.add('parent.1', { category: 'test' });
  presence.add('child.1', { category: 'test', parent: 'parent.1', timeout: 60000 });
  presence.add('child.2', { category: 'test', parent: 'parent.1' });

  // ACT
  const items = presence.getAll();

  // ASSERT
  t.true(Array.isArray(items));
  t.is(items.length, 3);
});
