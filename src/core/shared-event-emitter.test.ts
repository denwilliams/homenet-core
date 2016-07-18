import { createKernel } from '../inversify.testkernel';

import test from 'ava';

test.beforeEach(t => {
  const kernel = createKernel();
  t.context.kernel = kernel;
  t.context.eventBus = kernel.get('IEventBus');
});

test.skip('nothing yet', () => {});
