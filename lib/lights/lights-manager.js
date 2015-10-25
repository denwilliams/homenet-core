function LightsManager(classes, switches, commands, config, logger) {
  var instances = {};
  var types = {};
  this.types = types;

  this._logger = logger;
  logger.info('Starting lights manager');

  classes.addClass('light', addInstance);
  switches.addType('lights', function(opts) {
    return instances[opts.id]();
  }, [
    'turnOn',
    'turnOff'
  ]);
  commands.addType('lights', function(opts) {
    var instance = instances[opts.id]();
    return {
      turnOn: function() {
        instance.set(true);
      },
      turnOff: function() {
        instance.set(false);
      }
    };
  });

  function addInstance(instanceId, typeId, opts) {
    logger.info('Creating light with ID ' + instanceId + ' of type ' + typeId);
    instances[instanceId] = singleton(typeId, opts);
    switches.addInstance('light:'+instanceId, 'lights', {id: instanceId});
    commands.addInstance('light:'+instanceId, 'lights', {id: instanceId});
  }

  function singleton(typeId, opts) {
    var instance;

    return function() {
      if (!instance) instance = createInstance(typeId, opts);
      return instance;
    };
  }

  function createInstance(typeId, opts) {
    logger.info('Creating lights instance of type ' + typeId);
    var factory = types[typeId];
    if (factory) return factory(opts);

    logger.warn('No factory found for light type ' + typeId);
  }

  logger.info('... lights manager');

}

/**
 * Adds a new light type
 * @param {string} typeId  - ID of the type
 * @param {function} factory - 
 */
LightsManager.prototype.addType = function(typeId, factory) {
  this._logger.info('Adding light type ' + typeId);
  this.types[typeId] = factory;
};

LightsManager.prototype.getInstance = function(instanceId) {
  return instances[instanceId]();
};

module.exports = exports = LightsManager;



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