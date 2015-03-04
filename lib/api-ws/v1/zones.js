var Q = require('q');

module.exports = exports = function(broadcast, services, config) {
	var presence = services.presence;
	var lights = services.lights;
	var locks = services.locks;
	var sensors = services.sensors;

	var zones = services.zone.all.map(function(zone) {
		return {
			id: zone.id,
			name: zone.name,
			type: zone.type,
			// parent: zone.parent,
			// presence: false,
			// lights: zone.lights ? false : null,
			// locks: zone.locks ? false : null
		};
	});

	function getZone(id) {
		var zone = zones.filter(function(zone) {
			return zone.id === id;
		});
		if (zone.length === 0) return null;
		return zone[0];
	}

	sensors.on('sensor', function(data) {
		if (!data.zone) {
			console.error('Zone controller ignoring sensor with no zone specified', data);
			return;
		}
		var zone = getZone(data.id);

		switch (data.type) {
			case 'temperature':
				zone.temperature = data.value;
				break;
			case 'humidity':
				zone.humidity = data.value;
				break;
			default:
				console.log('Zone controller ignoring sensor with type ' + data.type);
				return;
		}
		broadcast('zoneChanged', zone);
	});

	presence.on('presence', function(data) {
		// ignore non-people
		if (data.category !== 'zone') return;


		console.log('ZONES API ~ PRESENCE:',data);
		var zone = getZone(data.id);

		if (!zone) return;

		zone.presence = data.present;

		broadcast('zoneChanged', zone);
	});

	// lights.on('lightChanged', function(data) {
	// 	console.log('lightChanged', data);
	// 	var zone = getZone(data.zone);

	// 	if (!zone) return;

	// 	zone.lights = data.on;
	// 	broadcast('zoneChanged', zone);
	// });

	// locks.on('lockChanged', function(data) {
	// 	console.log('lockChanged', data);
	// 	var zone = getZone(data.zone);

	// 	if (!zone) return;

	// 	zone.locks = data.locked;
	// 	broadcast('zoneChanged', zone);
	// });

	return {
		getAll: function() {
			return Q.when(zones);
		},
		getLightStates: function() {
			return Q.when(lights.states);
		},
		setLights: function(opts) {
			var zone = opts.zone;
			var mode = opts.mode;
			lights.setLights(zone, {value:mode});
			return Q.when(true);
		},
		setLocks: function(opts) {
			var zone = opts.zone;
			var mode = opts.mode;
			locks[zone][mode]();
			return Q.when(true);
		},
		lock: function(zone) {
			locks[zone].lock();
			return Q.when(true);
		},
		unlock: function(zone) {
			locks[zone].unlock();
			return Q.when(true);
		}
	};
};
