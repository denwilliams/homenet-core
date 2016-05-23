import { injectable, inject } from 'inversify';
import chalk = require('chalk');
// import {Homenet} from '../interfaces.d.ts';

const CLASS_ID = 'light';

@injectable()
class LightsManager implements Homenet.ILightsManager {

  private _logger: Homenet.ILogger;
  private _classes: Homenet.IClassesManager;
  private _switches: Homenet.ISwitchManager;
  private _commands: Homenet.ICommandManager;
  private _types: Homenet.Dict<Homenet.ILightFactory>;
  private _instances: Homenet.Dict<Homenet.Func<Homenet.ILight>>;

  constructor(
    @inject('IClassesManager') classes: Homenet.IClassesManager,
    @inject('ISwitchManager') switches: Homenet.ISwitchManager,
    @inject('ICommandManager') commands: Homenet.ICommandManager,
    @inject('IConfig') config: Homenet.IConfig,
    @inject('ILogger') logger: Homenet.ILogger) {

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

  _addClassType(classes: Homenet.IClassesManager) {
    this._logger.info('Adding class type ' + CLASS_ID);
    classes.addClass<Homenet.ILight>(CLASS_ID, this._addInstance.bind(this));
  }

  _addSwitchType(switches: Homenet.ISwitchManager) : void {
    this._logger.info('Adding switch type ' + CLASS_ID);
    const self = this;
    switches.addType(CLASS_ID, function(opts: {id:string}) : Homenet.ILight {
      return self._instances[opts.id]();
    });
  }

  _addCommandType(commands: Homenet.ICommandManager) : void {
    this._logger.info('Adding command type ' + CLASS_ID);
    const self = this;
    commands.addType(CLASS_ID, function(opts: any) {
      var id: string = opts.id;
      var instance: Homenet.ILight = self._instances[id]();
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
  addType(typeId: string, factory: Homenet.ILightFactory): void {
    this._logger.info('Adding light type ' + chalk.cyan(typeId));
    this._types[typeId] = factory;
  }

  getInstance(instanceId: string): Homenet.ILight {
    return this._instances[instanceId]();
  }

  _addInstance(instanceId: string, typeId: string, opts: any): void {
    this._logger.info('Creating light with ID ' + chalk.magenta(instanceId) + ' of type ' + chalk.cyan(typeId));
    this._instances[instanceId] = this._singleton(instanceId, typeId, opts);
    this._switches.addInstance(CLASS_ID, instanceId, {id: instanceId});
    this._commands.addInstance(CLASS_ID, instanceId, {id: instanceId});
  }

  _createInstance(id: string, typeId: string, opts: any) : Homenet.ILight {
    this._logger.info('Creating lights instance of type ' + typeId);
    var factory: Homenet.ILightFactory = this._types[typeId];
    if (factory) return factory(id, opts);

    this._logger.warn('No factory found for light type ' + typeId);
  }

  _singleton(id: string, typeId: string, opts: any) : Homenet.Func<Homenet.ILight> {
    var self = this;
    var instance : Homenet.ILight;

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
