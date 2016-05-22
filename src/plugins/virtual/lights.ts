import chalk = require('chalk');
import BaseSwitch = require('../../core/models/base-switch');

function factory(id: string, opts: any) : ILight {
  return new VirtualLight(id, opts);
}

class VirtualLight extends BaseSwitch<string> implements ILight {
  public id: string;
  public state: string;
  public emitOnSet: boolean;

  private _hub;

  constructor(id: string, opts: any) {
    super(id, true);

    this._hub = opts.hub;
    this.id = opts.id;
    this.state = 'unknown';
  }

  set(value: string) : void {
    this.state  = value;
    console.log(chalk.cyan('SET VIRTUAL LIGHT STATE TO ' + value));
  }

  get() : string {
    return this.state;
  }

  turnOn() : void {
    this.set('on');
  }

  turnOff() : void {
    this.set('off');
  }
}

export = factory;
