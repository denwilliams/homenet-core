var Q = require('q');

module.exports = exports = function(broadcast, services) {
	var sensors = services.sensors;
	sensors.on('sensor', function(sensor) {
		broadcast('triggered', sensor);
	});

	return {};
};
