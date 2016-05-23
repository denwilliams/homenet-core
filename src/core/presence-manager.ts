/// <reference path="../interfaces.d.ts"/>

import PresenceState = require('./models/presence-state');
import {EventEmitter} from 'events';
import {inject, injectable} from 'inversify';
// import {Homenet} from '../interfaces.d.ts';

/**
 * Manages and maintains presence state for devices, zones (rooms), people, and other entities.
 * *Note: id should be in the form of 'typeId.instanceId', for example 'lights.livingroom'.
 * @constructs PresenceManager
 * @memberOf module:presence
 * @implements {EventEmitter}
 * @example
 * presenceManager.add('lights.livingroom');
 * presenceManager.bump();
 */
@injectable()
class PresenceManagerImpl extends EventEmitter {

  private _items = {};
  private _parents = {};
  private _children = {};
  private _logger: Homenet.ILogger;
  private _eventBus: Homenet.IEventBus;

  constructor(
            @inject('IEventBus') eventBus: Homenet.IEventBus,
            @inject('ILogger') logger: Homenet.ILogger) {
    super();
    this._eventBus = eventBus;
    this._logger = logger;
  }


  /**
   * Adds a presence item to be watched
   * @method add
   * @memberOf module:presence.PresenceManager#
   * @param {string} id   - the unique ID of the item
   * @param {Object} opts - the options
   * @param {string} [opts.name] - Display name for this item
   * @param {string} [opts.parent] - ID of a parent presence item
   * @param {integer} [opts.timeout] - timeout in milliseconds before will become not present after a `bump()`
   * @param {string} [opts.category] - category id this belongs to
   */
  add(id: string, opts: any) {
    var parts = id.split('.');
    if (parts.length !== 2) {
      this._logger.error('Invalid presence ID - must be in the format type.instance');
      return;
    }
    this._logger.debug('Adding presence item of type ' + parts[0] + ' with instance ID ' + parts[1]);
    var p: PresenceState;
    var name = id;
    opts = opts || {};

    if (opts.parent) {

      this._children[opts.parent] = this._children[opts.parent] || [];
      this._children[opts.parent].push(name);

      this._parents[name] = this._parents[name] || [];
      this._parents[name].push(opts.parent);

    }

    p = new PresenceState({
      id: name,
      logger: this._logger,
      timeout: opts.timeout,
      category: opts.category || null,
      name: opts.name || name
    });

    // if (opts.timeout > 0) {

    //   p = new Presence({
    //     id: name,
    //     logger: logger,
    //     timeout: opts.timeout,
    //   });

    // } else if (opts.timeout < 0) {

    //   p = new Presence({
    //     id: name,
    //     logger: logger,
    //     timeout: opts.timeout,
    //   });

    // } else {

    //   p = new Presence({
    //     id: name,
    //     logger: logger,
    //     timeout: opts.timeout,
    //   });

    // }

    this._items[id] = p;

    p.on('present', this._activate.bind(null, name));

    return p;
}

  /**
   * Gets a registered presence
   * @method get
   * @memberOf module:presence.PresenceManager#
   * @param  {string} id - the id of the presence item
   * @return {PresenceState}
   */
  get(id: string) : PresenceState {
    var item = this._items[id];
    // if (!item) console.log(items, id, items[id]);
    return item;
  }

  /**
   * Gets all regsitered presence items
   * @method getAll
   * @memberOf module:presence.PresenceManager#
   * @return {Array<module:presence.PresenceState>} all available presence state items
   */
  getAll() {
    var arr = [];
    for (var i in this._items) {
      arr.push(this._items[i]);
    }
    return arr;
  }

  /**
   * Bumps the presence for an item.
   * The item will remain present as long as another bump is received within the timeout interval.
   * @method bump
   * @memberOf module:presence.PresenceManager#
   * @param  {string} id - the ID of the presence item
   */
  bump(id: string) : void {
    this._items[id].present();
  }

  /**
   * Returns true if the specified item is currently present.
   * @method isPresent
   * @memberOf module:presence.PresenceManager#
   * @param  {string}  id - the ID of the item to check for presence.
   * @return {boolean}    true if present
   */
  isPresent(id: string) : boolean {
    return this._items[id].isPresent;
  }

  /**
   * Defines a relationship between two presence items.
   * When a parent item is present when at least one of its children is present,
   * and away when all of its children are away.
   * @method addParent
   * @memberOf module:presence.PresenceManager#
   * @param {string} childId  - the id of the child item
   * @param {string} parentId - the id of the parent item
   */
  addParent(childId: string, parentId: string) : void {
    this._logger.debug('Adding '+parentId+' as parent of '+childId);

    this._children[parentId] = this._children[parentId] || [];
    this._children[parentId].push(childId);

    this._parents[childId] = this._parents[childId] || [];
    this._parents[childId].push(parentId);
  }

  /**
   * Unlinks or destroys a parent-child relationship
   * @method removeParent
   * @memberOf module:presence.PresenceManager#
   * @param  {string} childId  - the id of the child item
   * @param  {string} parentId - the id of the parent item
   */
  removeParent(childId: string, parentId: string) : void {
    this._logger.debug('Removing '+parentId+' as parent of '+childId);

    var childIdx = this._children[parentId].indexOf(childId);
    var parentIdx = this._parents[childId].indexOf(parentId);
    this._children[parentId].splice(childIdx,1);
    this._parents[childId].splice(parentIdx,1);
  }

  //// ---- private ---- ////

  _activate(item, present) {
    var details = this._items[item];
    this.emit(item, present);
    var args = {
      id:details.id,
      category:details.category,
      isPresent:details.isPresent,
      disabled:details.disabled
    }

    this.emit('presence', args);
    this._eventBus.emit('presence', details.id, present);

    var ps = this._getParents(item);

    // logger.debug('Parents of '+item+': '+ps.length);

    ps.forEach(function (p) {
      if (present) p.childActivated();
      else p.childDeactivated();
    });
  }

  _getParents(child) {
    var p = this._parents[child];
    if (!p) return [];

    return p.map(function(id) {
      return this._items[id];
    })
    .filter(function (item) {
      return !!this._items;
    });
  }

  _getChildren(parent) {
    var c = this._children[parent];
    if (!c) return [];

    return c.map(function(id) {
      return this._items[id];
    });
  }
}

export = PresenceManagerImpl;
