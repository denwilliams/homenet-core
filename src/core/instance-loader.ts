import {injectable, inject} from 'inversify';
import chalk = require('chalk');


@injectable()
export class InstanceLoader implements Homenet.IInstanceLoader {

  constructor(
        @inject('IClassesManager') private classes: Homenet.IClassesManager,
        @inject('ILogger') private logger: Homenet.ILogger) {
  }

  loadInstances(config: Homenet.IConfig) : void {
    this.logger.info('Loading instances from config...');
    if (config.instances) {
      config.instances.forEach(instance => {
        this.logger.info('Loading ' + chalk.green(instance.class + '/' + instance.type + '/' + instance.id));
        this.classes.addInstance(instance.class, instance.id, instance.type, instance.options);
      });
    }
    this.classes.initializeAll();
  }
}
