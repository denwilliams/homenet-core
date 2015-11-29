/**
 * Starts everything.
 * Require this module to start the core.
 * @module appStart
 */

module.exports = exports = factory;
exports.$implements = 'appStart';
exports.$inject = [
  'nodeRed',
  'nodeRedFlows',
  'storage',
  'people',
  'scene',
  'zone',
  'hosts',
  'media',
  'logger'
];

function factory (services) {
  var logger = services.logger.getLogger('appStart');
  logger.info('App started');
	setTimeout(function() {
		// services.nodeRedFlows.changeFlow('normal');
		// services.nodeRed.reload();
	}, 10000);
}
