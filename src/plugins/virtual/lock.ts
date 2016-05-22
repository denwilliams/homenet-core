import chalk = require('chalk');

import BaseSwitch = require('../../core/models/base-switch');

function createFactory(eventBus: IEventBus) {
  return function factory(id: string, opts: any) : ILock {
    return new VirtualLock(id, opts, eventBus);
  }
}

class VirtualLock extends BaseSwitch<boolean> implements ILock {

  private _controller: string;

  public emitOnSet: boolean = true;

  constructor(id: string, opts: any, eventBus: IEventBus) {
    super(id, true);
    this._controller = opts.controller;
  }

  set(value: boolean) : void {
    console.log(chalk.cyan('SET VIRTUAL LOCK STATE TO ' + value));
    super.set(value);
  }
}

export = createFactory;
