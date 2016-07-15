import { createKernel } from '../inversify.testkernel';
import test from 'ava';

test.beforeEach(t => {
  const kernel = createKernel();
  t.context.classesManager = kernel.get('IClassesManager');
});

test('should allow adding new instances of defined types', t => {
  // ARRANGE
  const classesManager: Homenet.IClassesManager = t.context.classesManager;
  const testFactory: Homenet.IClassFactory<any> = (id, type, opts) => ({ id, type, opts });
  classesManager.addClass('test', testFactory);

  // ACT
  classesManager.addInstance('test', 'myInstance', 'myType', {a: 1});
  // classesManager.initializeAll();
  const instance = classesManager.getInstance('test', 'myInstance');

  // ASSERT
  t.deepEqual<any>(instance, { id: 'myInstance', type: 'myType', opts: { a: 1 } });
});
