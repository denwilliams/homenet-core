import { injectable, inject } from 'inversify';
import chalk = require('chalk');

import { Macro, AVAILABLE_COMMANDS } from './models/macro';

const CLASS_ID = 'macro';

@injectable()
export class MacroManager implements Homenet.IMacroManager {
  private instances: Homenet.Dict<Homenet.IMacro>;

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
    const macro = this.getInstance(instanceId);
    if (macro) macro.execute();
  }

  getInstance(instanceId: string): Homenet.IMacro {
    return this.instances[instanceId];
  }

  getAllInstances(): Homenet.Dict<Homenet.IMacro> {
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
    var instance: Homenet.IMacro = new Macro(instanceId, this.eventBus);
    this.instances[instanceId] = instance;
    this.onAddInstance(instance, instanceId, opts);
    return instance;
  }

  protected onAddInstance(instance: Homenet.IMacro, instanceId: string, opts: any) : void {
    const fullId = `${CLASS_ID}.${instanceId}`;
    this.commands.addInstance(fullId, instance, AVAILABLE_COMMANDS);
  }
}
