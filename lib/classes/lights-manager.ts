/// <reference path="../../interfaces/interfaces.d.ts" />

class LightsManagerImpl implements ILightsManager {

  private _logger: ILogger;
  private _classes: IClassesManager;
  private _switches: ISwitchManager;
  private _commands: ICommandManager;
  private _types: Dict<ILightFactory>;
  private _instances: Dict<Func<ILight>>;

  constructor(
    classes: IClassesManager,
    switches: ISwitchManager,
    commands: ICommandManager,
    config: IConfig,
    logger: ILogger) {

    this._logger = logger;

    this._instances = {};
    this._types = {};

    logger.info('Starting lights manager');

    classes.addClass<ILight>('light', this._addInstance.bind(this));

    switches.addType('lights', function(opts: {id:string}) : ILight {
      return this._instances[opts.id]();
    });

    commands.addType('lights', function(opts: any) {
      var id: string = opts.id;
      var instance: ILight = this._instances[id]();
      return {
        turnOn: function() {
          instance.set(true);
        },
        turnOff: function() {
          instance.set(false);
        }
      };
    }, null);

    logger.info('... lights manager');
  }

  /**
   * Adds a new light type
   * @param {string} typeId  - ID of the type
   * @param {function} factory -
   */
  addType(typeId: string, factory: ILightFactory): void {
    this._logger.info('Adding light type ' + typeId);
    this._types[typeId] = factory;
  }

  getInstance(instanceId: string): ILight {
    return this._instances[instanceId]();
  }

  _addInstance(instanceId: string, typeId: string, opts: any): void {
    this._logger.info('Creating light with ID ' + instanceId + ' of type ' + typeId);
    this._instances[instanceId] = this._singleton(instanceId, typeId, opts);
    this._switches.addInstance('light:'+instanceId, 'lights', {id: instanceId});
    this._commands.addInstance('light:'+instanceId, 'lights', {id: instanceId});
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

export = LightsManagerImpl;


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
