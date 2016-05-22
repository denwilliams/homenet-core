import {injectable, inject} from 'inversify';
import chalk = require('chalk');


@injectable()
class InstanceLoader implements IInstanceLoader {

  private _classes : IClassesManager;
  private _logger: ILogger;

  constructor(
        @inject('IClassesManager') classes: IClassesManager,
        @inject('ILogger') logger: ILogger) {
    this._logger = logger;
    this._classes = classes;
  }

  loadInstances(config: IConfig) : void {
    this._logger.info('Loading instances from config...');
    const classes = this._classes;
    config.instances.forEach(instance => {
      this._logger.info('Loading ' + chalk.green(instance.class + '/' + instance.type + '/' + instance.id));
      classes.addInstance(instance.class, instance.id, instance.type, instance.options);
    });
    classes.initializeAll();
  }
}

export = InstanceLoader;
