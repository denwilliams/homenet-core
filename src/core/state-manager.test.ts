import { createKernel } from '../inversify.testkernel';
import test from 'ava';

class TestStateProvider implements Homenet.IStateProvider {
  public current: any;

  getCurrent() : Promise<string> {
    return Promise.resolve(this.current);
  }

  setCurrent(state: string) : Promise<string> {
    this.current = state;
    return Promise.resolve(this.current);
  }

  getAvailable(): string[] {
    return ['one', 'two', 'three'];
  }
}

test.beforeEach(t => {
  const kernel = createKernel();
  t.context.kernel = kernel;
  const stateManager = kernel.get<Homenet.IStateManager>('IStateManager');
  const stateProvider = new TestStateProvider();
  stateManager.addType('test', stateProvider);

  t.context.stateManager = stateManager;
  t.context.testState = stateProvider;
});

test('#setCurrent throws error if type unknown type', (t) => {
  // ARRANGE
  const stateManager:  Homenet.IStateManager = t.context.stateManager;

  // ACT
  const result = stateManager.setCurrent('faketype', 'nothing');

  // ASSERT
  t.throws(result, Error);
});

test('#setCurrent for a known type calls state provider #setCurrent', async (t) => {
  // ARRANGE
  const stateManager:  Homenet.IStateManager = t.context.stateManager;
  const testState:  TestStateProvider = t.context.testState;

  // ACT
  await stateManager.setCurrent('test', 'blah');

  // ASSERT
  t.is(testState.current, 'blah');
});

test('#setCurrent for a known type calls state provider #setCurrent', async (t) => {
  // ARRANGE
  const stateManager:  Homenet.IStateManager = t.context.stateManager;
  const testState:  TestStateProvider = t.context.testState;

  // ACT
  await stateManager.setCurrent('test', 'blah');

  // ASSERT
  t.is(testState.current, 'blah');
});

test.skip('events being fired', t => {
  t.fail();
});
