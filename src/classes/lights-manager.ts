import { injectable, inject } from 'inversify';
import { SwitchEventWrapper } from '../core/models/switch-event-wrapper';
import { Light } from './models/light';
import { SettableClassTypeManager } from '../utils/settable-class-type-manager';

import chalk = require('chalk');

const CLASS_ID = 'light';
const AVAILABLE_COMMANDS = {
  'turnOn': {
    "title": "Turn On",
    "comment": "Turns on the light"
  },
  'turnOff': {
    "title": "Turn Off",
    "comment": "Turns off the light"
  }
};

@injectable()
export class LightsManager extends SettableClassTypeManager<Homenet.ILight> implements Homenet.ILightsManager {
  constructor(
              @inject('IClassesManager') private classes: Homenet.IClassesManager,
              @inject('ISwitchManager') private switches: Homenet.ISwitchManager,
              @inject('ICommandManager') private commands: Homenet.ICommandManager,
              @inject('IEventBus') private eventBus: Homenet.IEventBus,
              // @inject('IConfig') config: Homenet.IConfig,
              @inject('ILogger') logger: Homenet.ILogger) {
    super(CLASS_ID, classes, logger);

    if (!classes) throw new Error('classes cannot be null');
    if (!switches) throw new Error('switches cannot be null');
    if (!commands) throw new Error('commands cannot be null');
    // if (!config) throw new Error('config cannot be null');
    if (!logger) throw new Error('logger cannot be null');
    if (!eventBus) throw new Error('eventBus cannot be null');
  }

  protected mapSettable(id: string, settable: Homenet.ISettable): Homenet.ILight {
    return new Light(id, settable, this.eventBus, this.logger);
  }

  protected onAddInstance(light: Homenet.ILight, instanceId: string, typeId: string, opts: any) : void {
    const fullId = `${CLASS_ID}.${instanceId}`;
    this.switches.addInstance(fullId, light);
    this.commands.addInstance(fullId, light, AVAILABLE_COMMANDS);
  }
}

/**
 * @class Light
 * @implements {SwitchMulti}
 * @implements {Command}
 * @implements {Type}
 */
/**
 * @method Light#run
 */
/**
 * @method Light#turnOff
 */
