var winston = require('winston');
var Papertrail = require('winston-papertrail').Papertrail;

var IMPLEMENTS = 'logger';
module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = 'config';

function factory(services) {
	var config = services.config;
	var logger = new Logger(config, 'logger');
  logger.info('Starting '+IMPLEMENTS+' module');
	logger = null;
	return {
		getLogger: function(name) {
			return new Logger(config, name);
		}
	};
}

/**
 * 
 */
function Logger(config, name) {
	var filename = config.logPath + name + '.log';
	
	var transports = [
		new (winston.transports.Console)({
			level: 'debug',
			colorize: true,
			timestamp: true
		}),
		new (winston.transports.File)({
			level: 'debug',
			filename: filename,
			json: false,
			colorize: true
		})
	];

	if (config.logging.papertrail) {
		transports.push(
			new winston.transports.Papertrail({
				level: 'debug',
				host: config.logging.papertrail.host,
				port: config.logging.papertrail.port
			})
		);
	}

	this._logger = new (winston.Logger)({
		transports: transports
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

