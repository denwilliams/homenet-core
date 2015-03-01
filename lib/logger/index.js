var winston = require('winston');


module.exports = exports = factory;
exports.$implements = 'logger';
exports.$inject = 'config';

function factory(services) {
	var config = services.config;
	return {
		getLogger: function(name) {
			return new Logger(config.logPath + name + '.log');
		}
	};
}

function Logger(file) {
	// console.log('Logging to ' + file);

	this._logger = new (winston.Logger)({
		transports: [
			new (winston.transports.Console)({ 
				level: 'debug',
				colorize: true,
				timestamp: true
			}),
			new (winston.transports.File)({ 
				level: 'debug',
				filename: file,
				json: false,
				colorize: true
			})
		]
	});
}

function log(context, method, args) {
	//var d = new Date();
	//context[method](d.toString().blue, args);
	context[method].apply(context,args);
}

Logger.prototype.log = function() {
	log(this._logger,'log',arguments);
};

Logger.prototype.info = function() {
	log(this._logger,'info',arguments);
};

Logger.prototype.warn = function() {
	log(this._logger,'warn',arguments);
};

Logger.prototype.error = function() {
	log(this._logger,'error',arguments);
};

Logger.prototype.debug = function() {
	log(this._logger,'debug',arguments);
};

