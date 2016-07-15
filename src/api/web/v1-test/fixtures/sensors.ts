import { EventEmitter } from 'events';

export const factory: Homenet.IClassTypeFactory<Homenet.ISensor> =
  (id : string, opts : any): Homenet.ISensor => {
    return new TestSensor(id, opts);
  };

class TestSensor extends EventEmitter implements Homenet.ISensor {
  public opts: Homenet.ISensorOpts;
  public isTrigger: boolean;
  public isToggle: boolean;
  public isValue: boolean;

  constructor(id: string, opts: any) {
    super();
    this.opts = opts;
    this.isTrigger = opts.isTrigger || false;
    this.isValue = opts.isValue || false;
    this.isToggle = opts.isToggle || false;
  }

  set(key: string, value: any) {
    this.emit('value', key, value);
  }
}
