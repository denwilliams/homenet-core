import chalk = require('chalk');

import { BaseSensor } from '../../core/models/base-sensor';

export function createSensorsFactory(triggers: Homenet.ITriggerManager, presence: Homenet.IPresenceManager, values: Homenet.IValuesManager) {
  return function factory(id: string, opts: any) : Homenet.ISensor {
    return new VirtualSensor(id, opts, triggers, presence, values);
  }
}

class VirtualSensor extends BaseSensor implements Homenet.ISensor {

  private _controller: string;

  public emitOnSet: boolean = true;

  constructor(instanceId: string, opts: any, triggers: Homenet.ITriggerManager, presence: Homenet.IPresenceManager, values: Homenet.IValuesManager) {
    super(instanceId, opts, triggers, presence, values);
    this._controller = opts.controller;

    setInterval(() => {
      this.trigger();
    }, 1000);
  }

  on() : void {
    console.log(chalk.cyan('SET VIRTUAL SENSOR STATE TO ON'));
    super.on();
  }
}
