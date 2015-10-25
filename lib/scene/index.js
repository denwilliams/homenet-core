/**
 * Manages the scene state for Homenet.
 * Injecting {@link module:scene|scene} will provide a {@link module:scene~SceneManager|SceneManager} instance.
 * @module scene
 * @example
 * function (scene) {
 *   console.log(scene.current);
 *   scene.set('away');
 * }
 */

module.exports = exports = factory;
exports.$service = 'scene';
exports.$inject = ['logger', 'storage', 'config', 'eventBus'];

var SceneManager = require('./scene-manager');

function factory(services) {

  var scenes = services.config.scenes;
  var storage = services.storage;
  var logger = services.logger.getLogger('scene');

  logger.debug('Initializing scene service');

  return storage.get('scene:active')
    .then(function(result) {

      logger.debug('Initial scene loaded from storage: ' + result);

      var opts = {
      
        eventBus: services.eventBus,
        // sceneLogic: services['scenelogic'],
        // initialScene: (services['sunlight'].isLight() ? 'normal' : 'night'),
        // initialScene: services.persistence.get('scene') || (services.sunlight.isLight() ? 'normal' : 'night'),
        // notifications: services.notifications,
        
        initialScene: result || 'normal',
        storage: services.storage,
        logger: logger
      
      };

      return new SceneManager(scenes || [], opts);
    });
}

