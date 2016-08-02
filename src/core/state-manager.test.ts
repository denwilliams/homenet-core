import { createKernel } from '../inversify.testkernel';
import test from 'ava';
import * as sinon from 'sinon';

class TestStateProvider implements Homenet.IStateProvider {
  public current: any;
  public emitOnSet: boolean = true;

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
  const eventBus = kernel.get<Homenet.IEventBus>('IEventBus');
  const stateProvider = new TestStateProvider();
  stateManager.addType('test', stateProvider);

  t.context.stateManager = stateManager;
  t.context.testState = stateProvider;
  t.context.eventBus = eventBus;
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

test('"changed" event are fired on eventBus if #emitOnState == true', async (t) => {
  // ARRANGE
  const stateManager:  Homenet.IStateManager = t.context.stateManager;
  const eventBus:  Homenet.IEventBus = t.context.eventBus;
  const testState:  TestStateProvider = t.context.testState;
  const spy = sinon.spy();
  eventBus.on('state', '*.changed', spy)

  // ACT
  await stateManager.setCurrent('test', 'blah');

  // ASSERT
  t.true(spy.calledOnce);
});

test('no event fired on eventBus if #emitOnState == false', async (t) => {
  // ARRANGE
  const stateManager:  Homenet.IStateManager = t.context.stateManager;
  const eventBus:  Homenet.IEventBus = t.context.eventBus;
  const testState:  TestStateProvider = t.context.testState;
  testState.emitOnSet = false;
  const spy = sinon.spy();
  eventBus.onAny(spy);

  // ACT
  await stateManager.setCurrent('test', 'blah');

  // ASSERT
  t.false(spy.called);
});
