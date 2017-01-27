import _ = require('lodash');
import {inject, injectable} from 'inversify';

/**
 * @constructor
 * @example
 * commandManager.addType('music:plex', plexSpec);
 * commandManager.addInstance('loungeroom:music', 'music:plex');
 * commandManager.run('loungeroom:music', 'pause')
 * commandManager.run('loungeroom:music', 'play', {playlist:'1234'});
 */
@injectable()
export class CommandManager implements Homenet.ICommandManager {
  private _instanceMeta: Homenet.Dict<Homenet.ICommandTypeMeta>;
  private _instances: Homenet.Dict<Homenet.ICommander>;
  private _logger: Homenet.ILogger;
  private _eventBus: Homenet.IEventBus;

  constructor(
        @inject('IEventBus') eventBus: Homenet.IEventBus,
        @inject('ILogger') logger: Homenet.ILogger) {
    this._instanceMeta = {};
    this._instances = {};
    this._logger = logger;
    this._eventBus = eventBus;
  }

  /**
  * Adds a new instance to the manager
  * @param {string} instanceId - unique ID for this instance
  * @param {string} typeId - type ID for this instance
  * @param {Object} opts - options
  */
  addInstance(id: string, instance: Homenet.ICommander, meta: Homenet.ICommandTypeMeta) : void {
    this._logger.debug(`Adding command instance ${id}`);
    this._instances[id] = instance;
    this._instanceMeta[id] = meta;
  }

  getInstance(id: string) : Homenet.ICommander {
    this._logger.debug('Getting command instance ' + id);
    return this._instances[id] || null;
  };

  getAll(): Homenet.Dict<Homenet.ICommander> {
    return this._instances;
  }

  /**
  * Runs a command on an instance
  * @param  {string} instanceId - the ID of the instance to run a command on
  * @param  {string} command  - the command to run
  * @param  {any[]} [args] - optional args to be passed to the command
  * @return {*} optionally a value may be returned
  */
  run(id: string, command: string, args?: any[]): Promise<any> {
    this._logger.debug(`Running command on instance ${id} - cmd: ${command}`);

    var instance: Homenet.ICommander = this._instances[id];
    if (!instance) return null;

    var cmdFn: Function = instance[command];
    if (!cmdFn) return null;

    var result = cmdFn.apply(instance, args);
    this._eventBus.emit(`command.${id}`, command, args);

    return result;
  };

  getMeta(id: string): Homenet.ICommandTypeMeta {
    this._logger.debug(`Getting meta for ${id}`);
    return this._instanceMeta[id];
  };
}
