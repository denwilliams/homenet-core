import { EventEmitter } from 'events';

export const factory: Homenet.ILightFactory = (id : string, opts : any): Homenet.ILight => {
  return new TestLight(id, opts);
};

class TestLight extends EventEmitter implements Homenet.ILight {
  public calls: string[] = [];
  public state: string = 'unknown';
  public id: string;
  public opts: any;

  constructor(id : string, opts : any) {
    super();
    this.id = id;
    this.opts = opts;
  }

  get() : string {
    this.calls.push('get');
    return this.state;
  }

  set(value: string|boolean) : void {
    this.calls.push('set');
    const newState: string = <string> (value === true ? 'on' : value === false ? 'off' : value);
    this.state = newState;
  }

  turnOn() : void {
    this.calls.push('turnOn');
  }

  turnOff() : void {
    this.calls.push('turnOff');
  }
}