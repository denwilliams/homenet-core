var IMPLEMENTS = 'hosts';
var INJECT = ['logger', 'config'];


var Q = require('q');
var netPing = require('net-ping');


function factory(services) {
  var hosts = [];
  var logger = services.logger.getLogger('hosts');
  var EventEmitter = require('events').EventEmitter;
  var e = new EventEmitter();

  try {

    var session = netPing.createSession();
    session.on('error', function(err) {
      logger.error('PING ERROR:', err);
      logger.error('PING ERROR STACK:', err.stack);
    });
    var pingHost = Q.nbind(session.pingHost, session);

    services.config.devices.forEach(function(dev) {
      addHost(dev);
    });

  } catch(err) {

    logger.warn(err.stack);

  }

  e.add = addHost;

  return e;

  /**
   * Adds a host to be monitored
   * @param {Object} config - {id:String, host:String, interval:Integer, intervalSuccess:Integer}
   *                        intervalSuccess allows for a longer or shorter interval to be used when the last check was successful. Used to save battery.
   */
  function addHost(config) {

    if (!pingHost) return;

    var pingEmitter = new EventEmitter();

    var online = false;

    var hostPing = setInterval(function() {

      ping(config.host).then(function() {

        updateStatus(true);

      }).fail(function(err) {

        updateStatus(false);

      });

    }, config.interval);

    function updateStatus(status) {
      // console.log(config.id, status);
      // if (online !== status) {
      //   online = status;
      //   onlineEmitter.emit(config.id, online);
      // }
      // logger.info('ping '+host.id,status);
      pingEmitter.emit(config.id, status);
    }

    return pingEmitter;

  }

  function ping(host) {
    return pingHost(host)
    .fail(function(err) {
      return pingHost(host);
    })
    .fail(function(err) {
      throw err;
    });
  }
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;
