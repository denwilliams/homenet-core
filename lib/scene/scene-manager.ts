/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/q/Q.d.ts" />

/// <reference path="../../interfaces/interfaces.d.ts" />

import Q = require('q');
import events = require('events');
import {EventEmitter} from 'events';

var bodyParser = require('body-parser');
var express = require('express');

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
class SceneManager {
  
  private _e : EventEmitter;
  private _eventBus : EventBus;
  private _logger : Logger;
  private _currentScene : string;
  private _scenes : ScenesDict;
  private _sceneLocked : boolean;
  private _storage : Storage;
  
  /** 
   * Gets the ID of the current scene
   * @member {string} module:scene~SceneManager#currentId
   */
  get currentId() : string {
    return this._currentScene;
  }
  
  /** 
   * Gets the current scene
   * @member {Scene} module:scene~SceneManager#current
   */
  get current() : Scene {
    return this._scenes[this._currentScene];
  }
  
  /** 
   * Gets all available scenes
   * @member {Object<string,Scene>} module:scene~SceneManager#scenes
   */
  get scenes() : ScenesDict {
    return this._scenes;
  }
  
  constructor(scenes : Scene[], options : {initialScene: string, eventBus: EventBus, storage: Storage, logger: Logger}) {

    this._e = new EventEmitter();
    this._eventBus = options.eventBus;
  
    var scenesDict : ScenesDict = {};
    scenes.forEach(function(scene) {
      scenesDict[scene.id] = scene;
    });
  
    this._scenes = scenesDict;
  
    // var sceneLogic = options.sceneLogic;
    // var notifications = options.notifications;
    this._storage = options.storage;
    this._logger = options.logger;
    this._sceneLocked = false;
  
    this._currentScene = 'day';
      
    // this.interfaces = {
    //   'scene/set': set
    // };
  
    this.onChanged(this.sceneChanged.bind(this));
    // notifications.send({title:'Initial scene', text:options.initialScene});
    this.set(options.initialScene);
  }
  
  /**
   * Sets or changes the current scene
   * @method module:scene~SceneManager#set
   * @param {string|Object} name - the scene to change to
   */
  set(name) {
    var locked = false;
    var force = false;

    if (typeof name === 'object') {
      locked = name.lock;
      force = name.force;
      name = name.value || name.id || 'none';
    }

    this._logger.debug('Changing scene to ' + name);

    if (this._sceneLocked && !force) {
      return;
    }

    var scene : Scene = this._scenes[name];

    if (scene) {
      this._currentScene = name;
      this._sceneLocked = !!locked;

      this._e.emit('sceneChanged', scene);
      this._eventBus.emit(SOURCE, 'changed', scene);
      this._storage.set('scene:active', name);
      // sceneLogic.loadScene(name);
    } else {
      this._logger.error('No such scene: ' + name);
    }
  }

  sceneChanged(scene : Scene) {
    this._logger.info('Current scene is now ' + (scene.name || scene.id));
  }

  on(what : string, callback : Function) {
    if (what === 'changed') {
      this.onChanged(callback);
    }
  }

  /**
   * Adds an event handler for the scene changed event
   * @method module:scene~SceneManager#onChanged
   * @param  {Function} callback - the handler to add
   */
  onChanged(callback : Function) {
    this._e.on('sceneChanged', callback);
  }

  /**
   * Removes a event handler for the scene changed event
   * @method module:scene~SceneManager#removeChanged
   * @param  {Function} callback - the handler to remove
   */
  removeOnChanged(callback : Function) {
    this._e.removeListener('sceneChanged', callback);
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

export = SceneManager;