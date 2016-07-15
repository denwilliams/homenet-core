import { createKernel } from '../inversify.testkernel';

import test from 'ava';

test.beforeEach(t => {
  t.context.kernel = createKernel();
});

test('nothing', () => {});
