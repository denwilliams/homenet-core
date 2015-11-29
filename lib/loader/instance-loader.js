/**
 * @constructor InstanceLoader
 * @classdesc
 * Loads instances from provided config.
 * 
 * *NOTE: this should be used after adding all classes and types.*
 * 
 * @param {ClassesManager} classes
 * @param {Config} config
 * @param {Logger} logger
 * @see module:loader
 */
function InstanceLoader(classes, config, logger) {

  /**
   * Loads instances defined in the provided config
   * @method InstanceLoader#load
   */
  this.load = function() {
    logger.info('Loading instances from config');
    config.instances.forEach(function(instance) {
      logger.debug('Adding instance ' + instance.class + '/' + instance.type + '/' + instance.id);
      classes.addInstance(instance.class, instance.id, instance.type, instance.options);
    });
    classes.initializeAll();
  };
}

module.exports = exports = InstanceLoader;
