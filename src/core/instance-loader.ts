import {injectable, inject} from 'inversify';
import chalk = require('chalk');


@injectable()
export class InstanceLoader implements Homenet.IInstanceLoader {

  private _classes : Homenet.IClassesManager;
  private _logger: Homenet.ILogger;

  constructor(
        @inject('IClassesManager') classes: Homenet.IClassesManager,
        @inject('ILogger') logger: Homenet.ILogger) {
    this._logger = logger;
    this._classes = classes;
  }

  loadInstances(config: Homenet.IConfig) : void {
    this._logger.info('Loading instances from config...');
    const classes = this._classes;
    config.instances.forEach(instance => {
      this._logger.info('Loading ' + chalk.green(instance.class + '/' + instance.type + '/' + instance.id));
      classes.addInstance(instance.class, instance.id, instance.type, instance.options);
    });
    classes.initializeAll();
  }
}
