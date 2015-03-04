module.exports = exports = factory;
exports.$implements = 'webServer';
exports.$inject = ['config', 'sensors', 'wsApi'];

function factory (services) {
	var express = require('express');
	var http = require('http');
	var config = services.config;

	var app = express();
	app.use(basicAuth());
	app.use('/sensor', services.sensors.app);
	app.get('/', redirectToUi);

	var server = http.createServer(app);
	services.wsApi.init(server);

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