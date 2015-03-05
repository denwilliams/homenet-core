var IMPLEMENTS = 'presence';
var INJECT = ['logger', 'config'];

var Presence = require('./presence');
var EventEmitter = require('events').EventEmitter;

function factory(services) {
  var logger = services.logger.getLogger('presence');

  var items = {};
  var parents = {};
  var children = {};

  var e = new EventEmitter();

  return {
    get: function (id) {
      var item = items[id];
      // if (!item) console.log(items, id, items[id]);
      return item;
    },
    getAll: function () {
      var arr = [];
      for (var i in items) {
        arr.push(items[i]);
      }
      return arr;
    },
    add: function(id, opts) {
      logger.debug('Adding ' + id);
      var p;
      var name = id;
      opts = opts || {};

      console.log('parent', opts.parent);

      if (opts.parent) {

        children[opts.parent] = children[opts.parent] || [];
        children[opts.parent].push(name);

        parents[name] = parents[name] || [];
        parents[name].push(opts.parent);

      }

      p = new Presence({
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
    },

    bump: function(id) {
      items[id].present();
    },

    isPresent: function(id) {
      return items[id].isPresent;
    },

    addParent: function(childId, parentId) {
      logger.debug('Adding '+parentId+' as parent of '+childId);

      children[childId] = children[childId] || [];
      children[childId].push(parentId);

      parents[parentId] = parents[parentId] || [];
      parents[parentId].push(childId);
    },

    removeParent: function(childId, parentId) {

    },

    on: e.on.bind(e),
    removeListener: e.removeListener.bind(e)
  };

  function activate(item, present) {
    var details = items[item];
    e.emit(item, present);
    e.emit('presence', {id:details.id, category:details.category, isPresent:details.isPresent, disabled:details.disabled});
    var ps = getParents(item);
    // console.log(ps);

    logger.debug('Parents of '+item, ps);

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

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;