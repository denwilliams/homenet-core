import { injectable, inject } from 'inversify';
import { SwitchEventWrapper } from '../core/models/switch-event-wrapper';
import { Light } from './models/light';

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
export class LightsManager implements Homenet.ILightsManager {

  private _logger: Homenet.ILogger;
  private _classes: Homenet.IClassesManager;
  private _switches: Homenet.ISwitchManager;
  private _commands: Homenet.ICommandManager;
  private _eventBus: Homenet.IEventBus;
  private _types: Homenet.Dict<Homenet.ILightSwitchFactory>;
  private _instances: Homenet.Dict<Homenet.ILight>;

  constructor(
    @inject('IClassesManager') classes: Homenet.IClassesManager,
    @inject('ISwitchManager') switches: Homenet.ISwitchManager,
    @inject('ICommandManager') commands: Homenet.ICommandManager,
    @inject('IEventBus') eventBus: Homenet.IEventBus,
    // @inject('IConfig') config: Homenet.IConfig,
    @inject('ILogger') logger: Homenet.ILogger) {

    if (!classes) throw new Error('classes cannot be null');
    if (!switches) throw new Error('switches cannot be null');
    if (!commands) throw new Error('commands cannot be null');
    // if (!config) throw new Error('config cannot be null');
    if (!logger) throw new Error('logger cannot be null');
    if (!eventBus) throw new Error('eventBus cannot be null');

    this._instances = {};
    this._types = {};

    this._classes = classes;
    this._switches = switches;
    this._commands = commands;
    // this._config = config;
    this._logger = logger;
    this._eventBus = eventBus;

    logger.info('Starting lights manager');

    this._addClassType(classes);
  }

  /**
   * Adds a new light type
   * @param {string} typeId  - ID of the type
   * @param {function} factory -
   */
  addType(typeId: string, factory: Homenet.ILightSwitchFactory): void {
    this._logger.info('Adding light type ' + chalk.cyan(typeId));
    this._types[typeId] = factory;
  }

  getInstance(instanceId: string): Homenet.ILight {
    return this._instances[instanceId];
  }

  private _addClassType(classes: Homenet.IClassesManager) {
    this._logger.info(`Adding class type ${CLASS_ID}`);
    classes.addClass<Homenet.ILight>(CLASS_ID, this._addInstance.bind(this));
  }

  private _addInstance(instanceId: string, typeId: string, opts: any): any {
    // const instance = this._singleton(instanceId, typeId, opts);
    this._logger.info('Creating light with ID ' + chalk.magenta(instanceId) + ' of type ' + chalk.cyan(typeId));
    const instance = this._createInstance(instanceId, typeId, opts);
    const fullId = `${CLASS_ID}.${instanceId}`;
    const light = new Light(fullId, instance, this._eventBus, this._logger);

    this._instances[instanceId] = light;
    this._switches.addInstance(fullId, light);
    this._commands.addInstance(fullId, light, AVAILABLE_COMMANDS);

    return light;
  }

  private _createInstance(id: string, typeId: string, opts: any) : Homenet.ILightSwitch {
    this._logger.info('Creating lights instance of type ' + typeId);
    const factory: Homenet.ILightSwitchFactory = this._types[typeId];
    if (factory) return factory(id, opts);
    this._logger.warn('No factory found for light type ' + typeId);
    return null;
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
