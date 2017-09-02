import { AVAILABLE_COMMANDS } from './models/lock';
import { injectable, inject } from 'inversify';
import chalk = require('chalk');

import { Macro, AVAILABLE_COMMANDS as COMMANDS } from './models/macro';
import { MacroSwitch, AVAILABLE_COMMANDS as SWITCH_COMMANDS } from './models/macro-switch';

const CLASS_ID = 'macro';

@injectable()
export class MacroManager implements Homenet.IMacroManager {
  private instances: Homenet.Dict<Homenet.IBaseMacro>;

  constructor(
      @inject('IClassesManager') private classes: Homenet.IClassesManager,
      @inject('ICommandManager') private commands: Homenet.ICommandManager,
      @inject('IEventBus') private eventBus: Homenet.IEventBus,
      @inject('IConfig') private config: Homenet.IConfig,
      @inject('ILogger') private logger: Homenet.ILogger
    ) {
    logger.info('Started macro manager');
    this.instances = {};
    this.addToClasses(classes);
  }

  execute(instanceId: string) {
    const macro = this.getInstance(instanceId) as Homenet.IMacro;
    if (macro) macro.execute();
  }

  turnOn(instanceId: string) {
    const macro = this.getInstance(instanceId) as Homenet.IMacroSwitch;
    if (macro) macro.turnOn();
  }

  turnOff(instanceId: string) {
    const macro = this.getInstance(instanceId) as Homenet.IMacroSwitch;
    if (macro) macro.turnOff();
  }

  getInstance(instanceId: string): Homenet.IBaseMacro {
    return this.instances[instanceId];
  }

  getAllInstances(): Homenet.Dict<Homenet.IBaseMacro> {
    return this.instances;
  }

  /**
   * Adds this type manager instance to the classes module
   * @param {ClassesManager} classes - classes module
   */
  private addToClasses(classes: Homenet.IClassesManager) {
    classes.addClass(CLASS_ID, this.addInstance.bind(this));
  }

  private addInstance(instanceId: string, typeId: string, opts: any) : Homenet.IMacro {
    this.logger.debug(`Creating ${chalk.cyan(CLASS_ID)} with ID ${chalk.green(instanceId)}`);
    var instance: Homenet.IMacro = new Macro(instanceId, this.eventBus, this.logger);
    this.instances[instanceId] = instance;
    this.onAddInstance(instance, instanceId, opts);
    return instance;
  }

  protected onAddInstance(instance: Homenet.IMacro, instanceId: string, opts: any) : void {
    const fullId = `${CLASS_ID}.${instanceId}`;
    this.commands.addInstance(fullId, instance, COMMANDS);
  }

  protected onAddSwitchInstance(instance: Homenet.IMacroSwitch, instanceId: string, opts: any) : void {
    const fullId = `${CLASS_ID}.${instanceId}`;
    this.commands.addInstance(fullId, instance, COMMANDS);
  }
}
