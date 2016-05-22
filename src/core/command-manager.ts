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
class CommandManagerImpl implements ICommandManager {

  types: Dict<ICommanderFactory>;
  typeMeta: Dict<ICommandTypeMeta>;
  instanceTypes: Dict<string>;
  instances: Dict<Func<ICommander>>;

  private _logger: ILogger;
  private _eventBus: IEventBus;

  constructor(
        @inject('IEventBus') eventBus: IEventBus,
        @inject('ILogger') logger: ILogger) {
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
  addType(typeId: string, factory: ICommanderFactory, meta: ICommandTypeMeta) : void {
    this._logger.info('Adding command type ' + typeId);
    this.types[typeId] = factory;
    this.typeMeta[typeId] = meta || {};
  };

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
  };

  getInstance(typeId: string, instanceId: string) : ICommander {
    var id:string = getId(typeId, instanceId);
    this._logger.debug('Getting command instance ' + id);
    var factory : Func<ICommander> = this.instances[id];
    return factory();
  };

  getAll(): Dict<ICommander> {
    return _.mapValues(this.instances, getCommander);
  };

  /**
  * Runs a command on an instance
  * @param  {string} instanceId - the ID of the instance to run a command on
  * @param  {string} command  - the command to run
  * @param  {Object} [args] - optional args to be passed to the command
  * @return {*} optionally a value may be returned
  */
  run(typeId: string, instanceId: string, command: string, args: any): any {
    var id: string = getId(typeId, instanceId);
    this._logger.debug('Running command on instance ' + instanceId + ' - cmd:' + command);

    var instance: ICommander = this.instances[id]();
    if (!instance) return null;

    var cmdFn: Function = instance[command];
    if (!cmdFn) return null;

    var result = cmdFn.call(instance, args);
    this._eventBus.emit('command.'+id, command, args);

    return result;
  };

  getMeta(typeId: string, instanceId: string): ICommandTypeMeta {
    var id: string = getId(typeId, instanceId);
    this._logger.debug('Getting meta for ' + id);
    var tid: string = this.instanceTypes[id];
    this._logger.debug('Type is ' + tid);

    return this.typeMeta[tid];
  };

  getTypeMeta(typeId) : ICommandTypeMeta {
    return this.typeMeta[typeId];
  };

  getType(typeId: string) : ICommanderFactory {
    return this.types[typeId];
  };

  _createSingletonInstance(typeId: string, opts: any) : Func<ICommander> {
    var factory: ICommanderFactory = this.getType(typeId);
    return singleton(factory, opts);
  };
}


function singleton(factory: ICommanderFactory, opts: any) : Func<ICommander> {
  var instance: ICommander;
  return function() {
    if (!instance) instance = factory(opts);
    return instance;
  };
}

function getId(typeId:string, instanceId:string) : string {
  if (instanceId) return typeId+'.'+instanceId;
  return typeId;
}

function getCommander(commanderFn: Func<ICommander>) : ICommander {
  return commanderFn();
}


export = CommandManagerImpl;
