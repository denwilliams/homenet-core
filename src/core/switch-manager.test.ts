import { createKernel } from '../inversify.testkernel';
import { EventEmitter } from 'events';
import test from 'ava';
import * as sinon from 'sinon';

class TestSwitch extends EventEmitter implements Homenet.ISwitch {
  private _state: any;
  public switchId: string;

  constructor(id: string) {
    super();
    this.switchId = id;
  }

  get() : any {
    return this._state;
  }
  set(value: any) : void {
    this._state = value;
  }
}

test.beforeEach(t => {
  const kernel = createKernel();
  const testSwitch = new TestSwitch('test.one');
  const switchManager = kernel.get<Homenet.ISwitchManager>('ISwitchManager');
  switchManager.addInstance(testSwitch.switchId, testSwitch);

  t.context.kernel = kernel;
  t.context.switchManager = switchManager;
  t.context.testSwitch = testSwitch;
});

test('#set calls #set on the typed switch', (t) => {
  // ARRANGE
  const val = 'ajdnfsdjlsda';
  const switches: Homenet.ISwitchManager = t.context.switchManager;
  const testSwitch = new TestSwitch('test.two');
  switches.addInstance(testSwitch.switchId, testSwitch);

  // ACT
  switches.set('test.two', val);

  // ASSERT
  t.is(testSwitch.get(), val);
});

test('#get calls #get on the typed switch', (t) => {
  // ARRANGE
  const val = 'oijioshd';
  const switches: Homenet.ISwitchManager = t.context.switchManager;
  const testSwitch: Homenet.ISwitch = new TestSwitch('test.three');
  switches.addInstance(testSwitch.switchId, testSwitch);
  testSwitch.set(val);

  // ACT
  const result = switches.get('test.three');

  // ASSERT
  t.is(result, val);
});