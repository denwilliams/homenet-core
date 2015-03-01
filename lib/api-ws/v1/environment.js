var Q = require('q');

module.exports = exports = function(broadcast, services) {
	var sunlight = services['sunlight'];
	sunlight.on('sunlight', function(lightState) {
		broadcast('sunlight', sunlight.current);
	});

	return {
		getCurrentSunlight: function() {
			return Q.when(sunlight.current);
		}
	};
};
