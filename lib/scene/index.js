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

var MODULE_NAME = 'scene';
module.exports = exports = factory;
exports.$service = MODULE_NAME;
exports.$inject = ['logger', 'storage', 'config', 'eventBus', 'states'];
var STATE_TYPE = MODULE_NAME;
var DEFAULT_SCENE = 'default';

var SceneManager = require('./scene-manager.ts');

function factory(services) {

  var scenes = services.config.scenes;
  var states = services.states;
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
        
        initialScene: result || DEFAULT_SCENE,
        storage: services.storage,
        logger: logger
      
      };

      var manager = new SceneManager(scenes || [], opts);
      states.addType(STATE_TYPE, {
        getCurrent: function() {
          return manager.current;
        },
        setCurrent: function(state) {
          manager.set(state);
        },
        emitOnSet: false
      });
      manager.onChanged(function(state) {
        states.emitState(STATE_TYPE, state);
      });
      return manager;
    });
}

