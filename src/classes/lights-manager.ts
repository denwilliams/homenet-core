import { injectable, inject } from 'inversify';
import chalk = require('chalk');

const CLASS_ID = 'light';

@injectable()
class LightsManager implements ILightsManager {

  private _logger: ILogger;
  private _classes: IClassesManager;
  private _switches: ISwitchManager;
  private _commands: ICommandManager;
  private _types: Dict<ILightFactory>;
  private _instances: Dict<Func<ILight>>;

  constructor(
    @inject('IClassesManager') classes: IClassesManager,
    @inject('ISwitchManager') switches: ISwitchManager,
    @inject('ICommandManager') commands: ICommandManager,
    @inject('IConfig') config: IConfig,
    @inject('ILogger') logger: ILogger) {

    if (!classes) throw new Error('classes cannot be null');
    if (!switches) throw new Error('switches cannot be null');
    if (!commands) throw new Error('commands cannot be null');
    if (!config) throw new Error('config cannot be null');
    if (!logger) throw new Error('logger cannot be null');

    this._instances = {};
    this._types = {};

    this._classes = classes;
    this._switches = switches;
    this._commands = commands;
    // this._config = config;
    this._logger = logger;

    logger.info('Starting lights manager');

    this._addClassType(classes);
    this._addSwitchType(switches);
    this._addCommandType(commands);
  }

  _addClassType(classes: IClassesManager) {
    this._logger.info('Adding class type ' + CLASS_ID);
    classes.addClass<ILight>(CLASS_ID, this._addInstance.bind(this));
  }

  _addSwitchType(switches: ISwitchManager) : void {
    this._logger.info('Adding switch type ' + CLASS_ID);
    const self = this;
    switches.addType(CLASS_ID, function(opts: {id:string}) : ILight {
      return self._instances[opts.id]();
    });
  }

  _addCommandType(commands: ICommandManager) : void {
    this._logger.info('Adding command type ' + CLASS_ID);
    const self = this;
    commands.addType(CLASS_ID, function(opts: any) {
      var id: string = opts.id;
      var instance: ILight = self._instances[id]();
      return {
        turnOn: function() {
          instance.set(true);
        },
        turnOff: function() {
          instance.set(false);
        }
      };
    }, null);
  }

  /**
   * Adds a new light type
   * @param {string} typeId  - ID of the type
   * @param {function} factory -
   */
  addType(typeId: string, factory: ILightFactory): void {
    this._logger.info('Adding light type ' + chalk.cyan(typeId));
    this._types[typeId] = factory;
  }

  getInstance(instanceId: string): ILight {
    return this._instances[instanceId]();
  }

  _addInstance(instanceId: string, typeId: string, opts: any): void {
    this._logger.info('Creating light with ID ' + chalk.magenta(instanceId) + ' of type ' + chalk.cyan(typeId));
    this._instances[instanceId] = this._singleton(instanceId, typeId, opts);
    this._switches.addInstance(CLASS_ID, instanceId, {id: instanceId});
    this._commands.addInstance(CLASS_ID, instanceId, {id: instanceId});
  }

  _createInstance(id: string, typeId: string, opts: any) : ILight {
    this._logger.info('Creating lights instance of type ' + typeId);
    var factory: ILightFactory = this._types[typeId];
    if (factory) return factory(id, opts);

    this._logger.warn('No factory found for light type ' + typeId);
  }

  _singleton(id: string, typeId: string, opts: any) : Func<ILight> {
    var self = this;
    var instance : ILight;

    return function() {
      if (!instance) instance = self._createInstance(id, typeId, opts);
      return instance;
    };
  }
}

export = LightsManager;


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
