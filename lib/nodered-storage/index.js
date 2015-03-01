var when = require('when');

module.exports = exports = function(services) {

	var nodeRedFlows = services.nodeRedFlows;

	return {

		init: function(settings) {
			return when.resolve();
		},

		getFlows: function() {
			return when.resolve(nodeRedFlows.getCurrentFlow());
		},

		saveFlows: function(flows) {
			return when.resolve(nodeRedFlows.saveCurrentFlow(flows));
		},

		getCredentials: function() {
			return when.resolve({});
		},

		saveCredentials: function(credentials) {
			console.log(credentials);
		},

		getSettings: function() {
			return when.resolve({});
		},

		saveSettings: function(settings) {
			console.log(settings);
		},

		getAllFlows: function() {
			return when.resolve([]);
		},

		getFlow: function(fn) {
			return when.reject();
		},

		saveFlow: function(fn, data) {
			console.log(fn, data);
		},

		getLibraryEntry: function(type, path) {

		},

		saveLibraryEntry: function(type, path, meta, body) {
			console.log(type, path, meta, body);
		}

	};

};
exports.$implements = 'nodeRedStorage';
exports.$inject = ['nodeRedFlows'];
