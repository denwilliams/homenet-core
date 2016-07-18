import chalk = require('chalk');
import { EventEmitter } from 'events';

export function createSensorsFactory() {
  return function factory(id: string, opts: any) : Homenet.ISensor {
    return new VirtualSensor(id, opts);
  }
}

class VirtualSensor extends EventEmitter implements Homenet.ISensor {

  public opts: Homenet.ISensorOpts;
  public isTrigger: boolean;
  public isToggle: boolean;
  public isValue: boolean;

  constructor(instanceId: string, opts: any) {
    super();
    this.opts = {
      timeout: opts.timeout,
      zoneId: opts.zone
    };
    this.isTrigger = true;
    setInterval(() => {
      this.emit('trigger');
    }, 1000);
  }
}
