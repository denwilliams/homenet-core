module.exports = exports = factory;
exports.$implements = 'webServer';
exports.$inject = ['config', 'sensors', 'wsApi'];

function factory (services) {
	var express = require('express');
	var http = require('http');
	var config = services.config;

	console.log(services);

	var app = express();
	var server = http.createServer(app);

	app.use('/sensor', services.sensors.app);
	services.wsApi.init(server);

	server.listen(config.webServerPort);

	return {
		server: server,
		app: app
	};
}
