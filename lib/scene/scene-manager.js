module.exports = exports = SceneManager;

var Q = require('q'),
    EventEmitter = require('events').EventEmitter;

var SOURCE = 'scene';

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
  
  Object.defineProperty(this, 'current', {get: function() { return scenes[currentScene]; }});
  Object.defineProperty(this, 'currentId', {get: function() { return currentScene; }});
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

  function onChanged(callback) {
    e.on('sceneChanged', callback);
  }

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
