/**
 * The hosts module monitors network connected (TCP/IP) hosts.
 * Injecting hosts will provide a {@link HostMonitor} instance.
 * @module hosts
 */

var IMPLEMENTS = 'hosts';
var INJECT = ['logger', 'config', 'presence'];

var HostMonitor = require('./host-monitor');

function factory(services) {
  var logger = services.logger.getLogger('hosts');
  var presence = services.presence;
  var config = services.config;
  return new HostMonitor(presence, config, logger);
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;
