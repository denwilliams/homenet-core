var EventEmitter2 = require('eventemitter2').EventEmitter2;
  
/**
 * @constructs SharedEventEmitter
 */
function create(logger) {
  
  var e = new EventEmitter2({
    wildcard:true,
    maxListeners: 50
  });

  return {
    /**
     * @method SharedEventEmitter#emit
     * @param  {string} source [description]
     * @param  {string} event  [description]
     * @param  {Mixed}  data   [description]
     */
    emit: function(source, event, data) {
      var name = eventName(source, event);
      // console.log('Listeners:', name, e.listeners(name));
      var evt = {
        name: name,
        data: data
      };
      e.emit(name, evt);
      logger.info('Event emitted: ' + name + ' -> ' + JSON.stringify(data));
    },
    /**
     * @method SharedEventEmitter#on
     * @param  {string}   source [description]
     * @param  {string}   event  [description]
     * @param  {Function} cb     [description]
     */
    on: function(source, event, cb) {
      var name = eventName(source, event);
      e.on(name, cb);
      // console.log('Listeners:', name, e.listeners(name));
    },
    /**
     * @method onAny
     * @memberOf SharedEventEmitter#
     * @param  {Function} cb - called on any event
     */
    onAny: function(cb) {
      e.onAny(cb);
    },
    /**
     * @method SharedEventEmitter#removeListener
     * @param  {string}   source [description]
     * @param  {string}   event  [description]
     * @param  {Function} cb     [description]
     */
    removeListener: function(source, event, registeredCb) {
      var name = eventName(source, event);
      e.removeListener(name, registeredCb);
      // console.log('Listeners:', name, e.listeners(name));
    }
  };
}

function eventName(source, event) {
  if (!event) return source;
  return source + '.' + event;
}


exports.create = create;