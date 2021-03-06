import { injectable, inject } from 'inversify';
import { Light, AVAILABLE_COMMANDS } from './models/light';
import { SettableClassTypeManager } from '../utils/settable-class-type-manager';

import chalk = require('chalk');

const CLASS_ID = 'light';

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

  protected mapSettable(id: string, settable: Homenet.ISettable, opts : any): Homenet.ILight {
    return new Light(id, settable, opts);
  }

  protected onAddInstance(light: Homenet.ILight, instanceId: string, typeId: string, opts: any) : void {
    this.switches.addInstance(light.switchId, light);
    this.commands.addInstance(light.commandId, light, AVAILABLE_COMMANDS);
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
