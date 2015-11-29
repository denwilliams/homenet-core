var EventEmitter = require('events').EventEmitter;
var Q = require('q');
var netPing = require('net-ping');

/**
 * Monitors network hosts by pinging them
 * @class HostMonitor
 * @implements EventEmitter
 */
function HostMonitor(presence, config, logger) {
  var hosts = [];
  var e = new EventEmitter();

  try {

    var session = netPing.createSession();
    session.on('error', function(err) {
      logger.error('PING ERROR:', err);
      logger.error('PING ERROR STACK:', err.stack);
    });
    var pingHost = Q.nbind(session.pingHost, session);

    config.devices.forEach(function(dev) {
      addHost(dev);
    });

  } catch(err) {

    // this will happen on some OSs when not running as root
    logger.warn(err.stack);

  }

  /**
   * Add a host to be monitored
   * @method HostMonitor#add
   * @param {Object} config - configuration of the host to monitor
   * @param {string} config.id - id of the host to be monitored
   * @param {integer} config.timeout - timeout for the ping packet in milliseconds
   * @param {Array<string>} [config.parents] - array of host IDs of parents
   */
  this.add = addHost;
  /** @method HostMonitor#on */
  this.on = e.on.bind(e);
  /** @method HostMonitor#emit */
  this.emit = e.emit.bind(e);
  /** @method HostMonitor#removeListener */
  this.removeListener = e.removeListener.bind(e);
  /** @method HostMonitor#removeAllListeners */
  this.removeAllListeners = e.removeAllListeners.bind(e);

  return e;

  /**
   * Adds a host to be monitored
   * @method HostMonitor#add2
   * @param {Object} config - {id:String, host:String, interval:Integer, intervalSuccess:Integer}
   *                        intervalSuccess allows for a longer or shorter interval to be used when the last check was successful. Used to save battery.
   */
  function addHost(config) {

    if (!pingHost) return;

    var pingEmitter = new EventEmitter();
    var presenceId = 'device:'+config.id;
    presence.add(presenceId, {category:'device', timeout:config.timeout});
    if (config.parents) {
      config.parents.forEach(function(parent) {
        presence.addParent(presenceId, parent);
      });
    }

    var online = false;

    var hostPing = setInterval(function() {

      ping(config.host).then(function() {

        updateStatus(true);

      }).fail(function(err) {

        updateStatus(false);

      });

    }, config.interval);

    function updateStatus(status) {
      // logger.debug('Ping ' + config.id + ': ' + status);

      pingEmitter.emit(config.id, status);
      if (status) presence.bump(presenceId);
    }

    return pingEmitter;

  }

  function ping(host) {
    return pingHost(host)
    .fail(function(err) {
      // try twice
      return pingHost(host);
    })
    .fail(function(err) {
      throw err;
    });
  }
}

module.exports = exports = HostMonitor;
