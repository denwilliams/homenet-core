var Q = require('q');

module.exports = exports = function(broadcast, services) {
	var stats = services['stats'];

	return {
		getAll: function() {
			return Q.when(stats.getAll());
		},
		get: function(key) {
			return Q.when(stats.get(key));
		}
	};
};
