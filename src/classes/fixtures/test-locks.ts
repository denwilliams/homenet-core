import { EventEmitter } from 'events';

export const config: Homenet.IConfig = {
  instances: [
    {
      id: 'one',
      class: 'lock',
      type: 'test',
      options: {id: 1}
    }
  ]
}

export function create() : Homenet.IClassTypeFactory<Homenet.ISettable> {
  return (id : string, opts : any): Homenet.ILock => {
    return new TestLock(id, opts);
  };
}

class TestLock extends EventEmitter implements Homenet.ILock {
  public calls: string[] = [];
  public state: boolean = false;
  public id: string;
  public opts: any;

  constructor(id : string, opts : any) {
    super();
    this.id = id;
    this.opts = opts;
  }

  get() : boolean {
    this.calls.push('get');
    return this.state;
  }

  set(value: boolean) : void {
    this.calls.push('set');
    this.state = value;
  }
}