module.exports = exports = SceneManager;

var Q = require('q'),
    EventEmitter = require('events').EventEmitter,
    bodyParser = require('body-parser'),
    express = require('express');

var SOURCE = 'scene';

/**
 * @typedef {Scene}
 * @property {string} id - unique ID
 * @property {string} [name] - display name
 * @property {string} [fa] - font awesome icon
 */

/**
 * Maintains current scene and managed scene changes
 * @class module:scene~SceneManager
 * @param {Array<Scene>} scenes - Array of scenes
 * @param {Object} options - Options
 */
function SceneManager(scenes, options) {
  var self = this;
  var e = new EventEmitter();
  var eventBus = options.eventBus;

  var scenesDict = {};
  scenes.forEach(function(scene) {
    scenesDict[scene.id] = scene;
  });

  scenes = scenesDict;

  // var sceneLogic = options.sceneLogic;
  // var notifications = options.notifications;
  var storage = options.storage;
  var logger = options.logger;
  var sceneLocked = false;

  var currentScene = 'day';
  
  /** 
   * Gets the current scene
   * @member {Scene} module:scene~SceneManager#current
   */
  Object.defineProperty(this, 'current', {get: function() { return scenes[currentScene]; }});
  /** 
   * Gets the ID of the current scene
   * @member {string} module:scene~SceneManager#currentId
   */
  Object.defineProperty(this, 'currentId', {get: function() { return currentScene; }});
  /** 
   * Gets all available scenes
   * @member {Object<string,Scene>} module:scene~SceneManager#scenes
   */
  Object.defineProperty(this, 'scenes', {get: function() { return scenes; }});
  
  this.set = set;
  this.onChanged = onChanged;
  this.removeOnChanged = removeOnChanged;
  this.on = on;

  // this.interfaces = {
  //   'scene/set': set
  // };

  init();

  function init() {
    onChanged(sceneChanged);
    // notifications.send({title:'Initial scene', text:options.initialScene});
    self.set(options.initialScene);
  }

  /**
   * Sets or changes the current scene
   * @method module:scene~SceneManager#set
   * @param {string|Object} name - the scene to change to
   */
  function set(name) {
    var locked = false;
    var force = false;

    if (typeof name === 'object') {
      locked = name.lock;
      force = name.force;
      name = name.value || name.id || 'none';
    }

    logger.debug('Changing scene to ' + name);

    if (sceneLocked && !force) {
      return;
    }

    var scene = scenes[name];

    if (scene) {
      currentScene = name;
      sceneLocked = !!locked;

      e.emit('sceneChanged', scene);
      eventBus.emit(SOURCE, 'changed', scene);
      storage.set('scene:active', name);
      // sceneLogic.loadScene(name);
    } else {
      logger.error('No such scene: ' + name);
    }
  }

  function sceneChanged(scene) {
    logger.info('Current scene is now ' + (scene.name || scene.id));
  }

  function on(what, callback) {
    if (what === 'changed') {
      onChanged(callback);
    }
  }

  /**
   * Adds an event handler for the scene changed event
   * @method module:scene~SceneManager#onChanged
   * @param  {Function} callback - the handler to add
   */
  function onChanged(callback) {
    e.on('sceneChanged', callback);
  }

  /**
   * Removes a event handler for the scene changed event
   * @method module:scene~SceneManager#removeChanged
   * @param  {Function} callback - the handler to remove
   */
  function removeOnChanged(callback) {
    e.removeListener('sceneChanged', callback);
  }
}





// var scenes = require('scenes.json')
//  , currentScene =  '';

// var eventEmitter = new EventEmitter();

// module.exports = exports = eventEmitter;

// initEmitter(eventEmitter);

// exports.set = setScene;
// exports.get = getScene;

// function setScene(sceneName) {
//  currentScene = sceneName;
// }

// function getScene() {
//  return scenes[currentScene];
// }

// function initEmitter(emitter) {
//  emitter.
// }
