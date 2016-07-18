import _ = require('lodash');
import {inject, injectable} from 'inversify';
// import {Homenet} from '../interfaces.d.ts';

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

  types: Homenet.Dict<Homenet.ICommanderFactory>;
  typeMeta: Homenet.Dict<Homenet.ICommandTypeMeta>;
  instanceTypes: Homenet.Dict<string>;
  instances: Homenet.Dict<Homenet.Func<Homenet.ICommander>>;

  private _logger: Homenet.ILogger;
  private _eventBus: Homenet.IEventBus;

  constructor(
        @inject('IEventBus') eventBus: Homenet.IEventBus,
        @inject('ILogger') logger: Homenet.ILogger) {
    this.types = {};
    this.typeMeta = {};
    this.instanceTypes = {};
    this.instances = {};
    this._logger = logger;
    this._eventBus = eventBus;
  }

  /**
  * Adds a type and the associated commands.
  * @param {string} typeId - identifier for the type
  * @param {function} factory - factory for this type
  */
  addType(typeId: string, factory: Homenet.ICommanderFactory, meta: Homenet.ICommandTypeMeta) : void {
    this._logger.info('Adding command type ' + typeId);
    this.types[typeId] = factory;
    this.typeMeta[typeId] = meta || {};
  }

  /**
  * Adds a new instance to the manager
  * @param {string} instanceId - unique ID for this instance
  * @param {string} typeId - type ID for this instance
  * @param {Object} opts - options
  */
  addInstance(typeId: string, instanceId: string, opts: any) : void {
    var id:string = getId(typeId, instanceId);
    this._logger.debug('Adding command instance ' + instanceId + ' of type ' + typeId + '   ' + id);
    this.instances[id] = this._createSingletonInstance(typeId, opts);
    this.instanceTypes[id] = typeId;
  }

  getInstance(typeId: string, instanceId?: string) : Homenet.ICommander {
    var id:string = getId(typeId, instanceId);
    this._logger.debug('Getting command instance ' + id);
    var factory : Homenet.Func<Homenet.ICommander> = this.instances[id];
    if (!factory) return null;
    return factory();
  };

  getAll(): Homenet.Dict<Homenet.ICommander> {
    return _.mapValues(this.instances, getCommander);
  }

  /**
  * Runs a command on an instance
  * @param  {string} instanceId - the ID of the instance to run a command on
  * @param  {string} command  - the command to run
  * @param  {any[]} [args] - optional args to be passed to the command
  * @return {*} optionally a value may be returned
  */
  run(typeId: string, instanceId: string, command: string, args?: any[]): Promise<any> {
    var id: string = getId(typeId, instanceId);
    this._logger.debug('Running command on instance ' + instanceId + ' - cmd:' + command);

    var instance: Homenet.ICommander = this.instances[id]();
    if (!instance) return null;

    var cmdFn: Function = instance[command];
    if (!cmdFn) return null;

    var result = cmdFn.apply(instance, args);
    this._eventBus.emit('command.'+id, command, args);

    return result;
  };

  getMeta(typeId: string, instanceId?: string): Homenet.ICommandTypeMeta {
    var id: string = getId(typeId, instanceId);
    this._logger.debug('Getting meta for ' + id);
    var tid: string = this.instanceTypes[id];
    this._logger.debug('Type is ' + tid);

    return this.typeMeta[tid];
  };

  getTypeMeta(typeId) : Homenet.ICommandTypeMeta {
    return this.typeMeta[typeId];
  };

  getType(typeId: string) : Homenet.ICommanderFactory {
    return this.types[typeId];
  };

  _createSingletonInstance(typeId: string, opts: any) : Homenet.Func<Homenet.ICommander> {
    var factory: Homenet.ICommanderFactory = this.getType(typeId);
    return singleton(factory, opts);
  };
}


function singleton(factory: Homenet.ICommanderFactory, opts: any) : Homenet.Func<Homenet.ICommander> {
  var instance: Homenet.ICommander;
  return function() {
    if (!instance) instance = factory(opts);
    return instance;
  };
}

function getId(typeId:string, instanceId:string) : string {
  if (instanceId) return typeId+'.'+instanceId;
  return typeId;
}

function getCommander(commanderFn: Homenet.Func<Homenet.ICommander>) : Homenet.ICommander {
  return commanderFn();
}
