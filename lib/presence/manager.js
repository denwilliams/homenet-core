var PresenceState = require('./presence-state');
var EventEmitter = require('events').EventEmitter;

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
function PresenceManager(logger) {
  var items = {};
  var parents = {};
  var children = {};

  var e = new EventEmitter();

  /**
   * Gets a registered presence
   * @method get
   * @memberOf module:presence.PresenceManager#
   * @param  {string} id - the id of the presence item
   * @return {PresenceState}
   */
  this.get = function (id) {
    var item = items[id];
    // if (!item) console.log(items, id, items[id]);
    return item;
  };

  /**
   * Gets all regsitered presence items
   * @method getAll
   * @memberOf module:presence.PresenceManager#
   * @return {Array<module:presence.PresenceState>} all available presence state items
   */
  this.getAll = function () {
    var arr = [];
    for (var i in items) {
      arr.push(items[i]);
    }
    return arr;
  };

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
  this.add = function(id, opts) {
    var parts = id.split('.');
    if (parts.length !== 2) {
      logger.error('Invalid presence ID - must be in the format type.instance');
      return;
    }
    logger.debug('Adding presence item of type ' + parts[0] + ' with instance ID ' + parts[1]);
    var p;
    var name = id;
    opts = opts || {};

    if (opts.parent) {

      children[opts.parent] = children[opts.parent] || [];
      children[opts.parent].push(name);

      parents[name] = parents[name] || [];
      parents[name].push(opts.parent);

    }

    p = new PresenceState({
      id: name,
      logger: logger,
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

    items[id] = p;

    p.on('present', activate.bind(null, name));

    return p;
  };

  /**
   * Bumps the presence for an item.
   * The item will remain present as long as another bump is received within the timeout interval.
   * @method bump
   * @memberOf module:presence.PresenceManager#
   * @param  {string} id - the ID of the presence item
   */
  this.bump = function(id) {
    items[id].present();
  };

  /**
   * Returns true if the specified item is currently present.
   * @method isPresent
   * @memberOf module:presence.PresenceManager#
   * @param  {string}  id - the ID of the item to check for presence.
   * @return {boolean}    true if present
   */
  this.isPresent = function(id) {
    return items[id].isPresent;
  };

  /**
   * Defines a relationship between two presence items.
   * When a parent item is present when at least one of its children is present,
   * and away when all of its children are away.
   * @method addParent
   * @memberOf module:presence.PresenceManager#
   * @param {string} childId  - the id of the child item
   * @param {string} parentId - the id of the parent item
   */
  this.addParent = function(childId, parentId) {
    logger.debug('Adding '+parentId+' as parent of '+childId);

    children[parentId] = children[parentId] || [];
    children[parentId].push(childId);

    parents[childId] = parents[childId] || [];
    parents[childId].push(parentId);
  };

  /**
   * Unlinks or destroys a parent-child relationship
   * @method removeParent
   * @memberOf module:presence.PresenceManager#
   * @param  {string} childId  - the id of the child item
   * @param  {string} parentId - the id of the parent item
   */
  this.removeParent = function(childId, parentId) {
    logger.debug('Removing '+parentId+' as parent of '+childId);

    var childIdx = children[parentId].indexOf(childId);
    var parentIdx = parents[childId].indexOf(parentId);
    children[parentId].splice(childIdx,1);
    parents[childId].splice(parentIdx,1);
  };

  /**
   * @method on
   * @memberOf module:presence.PresenceManager#
   */
  this.on = e.on.bind(e);

  /**
   * @method removeListener
   * @memberOf module:presence.PresenceManager#
   */
  this.removeListener = e.removeListener.bind(e);



  //// ---- private ---- ////

  function activate(item, present) {
    var details = items[item];
    e.emit(item, present);
    e.emit('presence', {
      id:details.id,
      category:details.category,
      isPresent:details.isPresent,
      disabled:details.disabled
    });
    
    var ps = getParents(item);

    // logger.debug('Parents of '+item+': '+ps.length);

    ps.forEach(function (p) {
      if (present) p.childActivated();
      else p.childDeactivated();
    });
  }

  function getParents(child) {
    var p = parents[child];
    if (!p) return [];

    return p.map(function(id) {
      return items[id];
    })
    .filter(function (item) {
      return !!items;
    });
  }

  function getChildren(parent) {
    var c = children[child];
    if (!c) return [];

    return c.map(function(id) {
      return items[id];
    });
  }
}

module.exports = exports = PresenceManager;
