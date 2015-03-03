module.exports = exports = factory;
exports.$implements = 'appStart';
exports.$inject = [
  'nodeRed',
  'nodeRedFlows',
  'storage',
  'people',
  'scene',
  'zone',
  'hosts'
];

function factory (services) {
	setTimeout(function() {
		// services.nodeRedFlows.changeFlow('normal');
		// services.nodeRed.reload();
	}, 10000);
}
