import { createKernel, IKernel } from '../inversify.testkernel';
import { EventEmitter } from 'events';
import test from 'ava';
import * as sinon from 'sinon';

class TestSwitch extends EventEmitter implements Homenet.ISwitch {
  private _state: any;
  get() : any {
    return this._state;
  }
  set(value: any) : void {
    this._state = value;
  }
}


test.beforeEach(t => {
  const kernel = createKernel();
  const testSwitch = new TestSwitch();
  const switchFactory: Homenet.ISwitchFactory = sinon.spy((): Homenet.ISwitch => { return testSwitch; });
  const switchManager = kernel.get<Homenet.ISwitchManager>('ISwitchManager');
  switchManager.addType('test', switchFactory);
  switchManager.addInstance('test', 'one', {test: true});

  t.context.kernel = kernel;
  t.context.switchManager = switchManager;
  t.context.switchFactory = switchFactory;
  t.context.testSwitch = testSwitch;
});

test('#addInstance lazy loads from switch factory with #get', (t) => {
  // ARRANGE
  const switches: Homenet.ISwitchManager = t.context.switchManager;
  const spy: sinon.SinonSpy = t.context.switchFactory;

  // ACT
  switches.addInstance('test', 'two', {test: true});
  const factoryCalledAfterAdd = spy.called;
  const instance = switches.get('test', 'two');
  const factoryCalledAfterGet = spy.called;

  // ASSERT
  t.false(factoryCalledAfterAdd);
  t.true(factoryCalledAfterGet);
});

test('#addInstance lazy loads from switch factory with #set', (t) => {
  // ARRANGE
  const switches: Homenet.ISwitchManager = t.context.switchManager;
  const spy: sinon.SinonSpy = t.context.switchFactory;

  // ACT
  switches.addInstance('test', 'two', {test: true});
  const factoryCalledAfterAdd = spy.called;
  const instance = switches.set('test', 'two', true);
  const factoryCalledAfterSet = spy.called;

  // ASSERT
  t.false(factoryCalledAfterAdd);
  t.true(factoryCalledAfterSet);
});

test('#getInstance returns a lazy loading ISwitch wrapper', (t) => {
  // ARRANGE
  const switches: Homenet.ISwitchManager = t.context.switchManager;
  const spy: sinon.SinonSpy = t.context.switchFactory;

  // ACT
  switches.addInstance('test', 'two', {test: true});
  const factoryCalledAfterAdd = spy.called;
  const instance = switches.getInstance('test', 'two');
  const factoryCalledAfterGetInstance = spy.called;
  const value = instance.get();
  const factoryCalledAfterGet = spy.called;

  // ASSERT
  t.false(factoryCalledAfterAdd);
  t.false(factoryCalledAfterGetInstance);
  t.true(factoryCalledAfterGet);
  t.true(spy.calledOnce);
});

test('#addInstance lazy loads from switch factory with #getAllInstances', (t) => {
  // ARRANGE
  const switches: Homenet.ISwitchManager = t.context.switchManager;
  const spy: sinon.SinonSpy = t.context.switchFactory;

  // ACT
  switches.addInstance('test', 'two',   {test: true});
  switches.addInstance('test', 'three', {test: true});
  const factoryCalledAfterAdd = spy.called;
  const factoryCalledAfterGetInstance = spy.called;
  const instances = switches.getAllInstances();
  instances['test.two'].get();
  const factoryCalledAfterGet = spy.called;

  // ASSERT
  t.false(factoryCalledAfterAdd);
  t.false(factoryCalledAfterGetInstance);
  t.true(factoryCalledAfterGet);
  t.true(spy.calledOnce);
});

test('#set calls #set on the typed switch', (t) => {
  // ARRANGE
  const val = 'ajdnfsdjlsda';
  const switches: Homenet.ISwitchManager = t.context.switchManager;
  const spy: sinon.SinonSpy = t.context.switchFactory;
  const testSwitch = t.context.testSwitch;
  switches.addInstance('test', 'two',   {test: true});

  // ACT
  switches.set('test', 'two', val);

  // ASSERT
  t.is(testSwitch.get(), val);
  t.true(spy.calledOnce);
});

test('#get calls #get on the typed switch', (t) => {
  // ARRANGE
  const val = 'oijioshd';
  const switches: Homenet.ISwitchManager = t.context.switchManager;
  const spy: sinon.SinonSpy = t.context.switchFactory;
  const testSwitch: Homenet.ISwitch = t.context.testSwitch;
  switches.addInstance('test', 'two',   {test: true});
  testSwitch.set(val);

  // ACT
  const result = switches.get('test', 'two');

  // ASSERT
  t.is(result, val);
  t.true(spy.calledOnce);
});