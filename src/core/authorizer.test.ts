import { createKernel } from '../inversify.testkernel';
import test from 'ava';

test.beforeEach(t => {
  const kernel = createKernel();
  t.context.authorizer = kernel.get('IAuthorizer');
});

test('should authorize a valid token', async (t) => {
  // ARRANGE
  const authorizer: Homenet.IAuthorizer = t.context.authorizer;

  // ACT
  const result: any = await authorizer.authorize('test123');

  // ASSERT
  t.is(result, '007');
});

test('should throw error for invalid token', async (t) => {
  // ARRANGE
  const authorizer: Homenet.IAuthorizer = t.context.authorizer;

  // ACT
  const result: any = authorizer.authorize('notvalid');

  // ASSERT
  t.throws(result, /not authorized/i);
});