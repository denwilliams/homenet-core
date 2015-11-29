/// <reference path="../../interfaces/interfaces.d.ts" />


class LightsManager {
  
  private _logger: Logger;
  private _classes: ClassesManager;
  private _switches: SwitchManager;
  private _commands: CommandManager;
  private _types: Dict<LightFactory>;
  private _instances: Dict<Func<Light>>;
  
  constructor(classes : ClassesManager, switches: SwitchManager, commands : CommandManager, config: Config, logger: Logger) {
    
    this._logger = logger;

    this._instances = {};
    this._types = {};
  
    logger.info('Starting lights manager');
  
    classes.addClass<Light>('light', this._addInstance.bind(this));
    
    switches.addType('lights', function(opts) {
      return this._instances[opts.id]();
    });
    
    commands.addType('lights', function(opts: any) {
      var id: string = opts.id;
      var instance: Light = this._instances[id]();
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
  addType(typeId: string, factory: LightFactory): void {
    this._logger.info('Adding light type ' + typeId);
    this._types[typeId] = factory;
  }
  
  getInstance(instanceId: string): Light {
    return this._instances[instanceId]();
  }

  _addInstance(instanceId: string, typeId: string, opts: any): void {
    this._logger.info('Creating light with ID ' + instanceId + ' of type ' + typeId);
    this._instances[instanceId] = this._singleton(instanceId, typeId, opts);
    this._switches.addInstance('light:'+instanceId, 'lights', {id: instanceId});
    this._commands.addInstance('light:'+instanceId, 'lights', {id: instanceId});
  }

  _createInstance(id: string, typeId: string, opts: any) : Light {
    this._logger.info('Creating lights instance of type ' + typeId);
    var factory: LightFactory = this._types[typeId];
    if (factory) return factory(id, opts);

    this._logger.warn('No factory found for light type ' + typeId);
  }
  
  _singleton(id: string, typeId: string, opts: any) : Func<Light> {
    var self = this;
    var instance : Light;
  
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

