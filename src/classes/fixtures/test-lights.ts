import { EventEmitter } from 'events';

export const config: Homenet.IConfig = {
  instances: [
    {
      id: 'one',
      class: 'light',
      type: 'test',
      options: {id: 1}
    },
    {
      id: 'two',
      class: 'light',
      type: 'test',
      options: {id: 2}
    },
    {
      id: 'three',
      class: 'light',
      type: 'test',
      options: {id: 3}
    }
  ]
}

export function create() : Homenet.IClassTypeFactory<Homenet.ISettable> {
  return (id : string, opts : any): Homenet.ISettable => {
    return new TestLight(id, opts);
  };
}

class TestLight extends EventEmitter implements Homenet.ISettable {
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
    this.emit('update', newState);
  }
}