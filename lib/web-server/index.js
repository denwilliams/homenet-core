module.exports = exports = factory;
exports.$implements = 'webServer';
exports.$inject = ['utils', 'api'];

function factory (services) {
	var express = require('express');
	var http = require('http');

	var config = services.utils.config;

	var app = express();
	app.use(basicAuth());

	app.use('/api', services.api.webApi.app);
	// app.use('/sensor', services.sensors.app);
	// app.use('/people', services.people.app);
	app.get('/', redirectToUi);

	var server = http.createServer(app);
	services.api.wsApi.init(server);

	server.listen(config.webServerPort);

	return {
		server: server,
		app: app
	};
}


function redirectToUi(req, res) {
	res.redirect('http://homeconsole.me');
}

function basicAuth() {
	return function(req, res, next) {
		// TODO: add this
		next();
	};
}