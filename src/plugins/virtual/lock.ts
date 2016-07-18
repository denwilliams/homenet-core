/// <reference path="../../interfaces.d.ts"/>
import chalk = require('chalk');
// import {Homenet} from '../../interfaces.d.ts';

import BaseSwitch = require('../../core/models/base-switch');

function createFactory(eventBus: Homenet.IEventBus) {
  return function factory(id: string, opts: any) : Homenet.ILock {
    return new VirtualLock(id, opts, eventBus);
  }
}

class VirtualLock extends BaseSwitch<boolean> implements Homenet.ILock {

  private _controller: string;

  public emitOnSet: boolean = true;

  constructor(id: string, opts: any, eventBus: Homenet.IEventBus) {
    super(id, true);
    this._controller = opts.controller;
  }

  set(value: boolean) : void {
    console.log(chalk.cyan('SET VIRTUAL LOCK STATE TO ' + value));
    super.set(value);
  }
}

export = createFactory;
