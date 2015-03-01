'use strict';
var IMPLEMENTS = 'nodeRedFlows';
var INJECT = ['config', 'logger', 'eventBus', 'storage'];

var fs = require('fs');
var EventEmitter = require('events').EventEmitter;

function factory(services) {
	var config = services.config;
	var flowsPath = config.dataPath + 'flows.json';
	var eventBus = services.eventBus;
	var storage = services.storage;
	var logger = services.logger.getLogger('flows');

	var flows = {_selected: 'night'};
	var events = new EventEmitter();

	if (fs.existsSync(flowsPath)) {
		logger.info('Loading saved flows from file: ' + flowsPath);
		flows = require(flowsPath);
	}

  eventBus.on('scene', 'changed', function(scene) {
    // console.log('new scene....',scene);
    svc.changeFlow(scene.id);
  });

  var COMMON_DEFAULT = 
   [ { type: 'tab',
       id: 'tab.common',
       label: 'Common' } ];


	var svc = {
		on: events.on.bind(events),
		getCurrentFlow: function() {
			logger.debug('Getting flows for scene: ' + flows._selected);
			// console.log('flows...',flows._selected,flows[flows._selected]);
			var f = flows[flows._selected] || 
				[
					{ type: 'tab', id: 'tab.'+flows._selected, label: flows._selected },
					{ type: 'current-scene', id: 'current-scene.'+flows._selected, name:'', x:75, y:20, z:'tab.'+flows._selected, wires:[]}
				];

			var common = (flows.common) ? flows.common : COMMON_DEFAULT;

			f = f.concat(common);
			return f;
		},
		saveCurrentFlow: function(data) {
			var current = [];
			var common = [];

			if (data.length > 0 && data[0].id !== 'tab.'+flows._selected) {
				throw new Error('Cannot deploy flow - scene has been changed. Please change scene to '+data[0].id+' then try again. (Scene is currently '+flows._selected+')');
			}

			var commonTabs = data.filter(function (item) {
				if (item.type !== 'tab') return false;
				if (!item.label) return false;

				var strStart = item.label.substring(0, 6);
				return strStart === 'Common';
			}).map(function (item) {
				return item.id;
			});

			console.log(commonTabs);

			data.forEach(function(item) {
				if (commonTabs.indexOf(item.id) >= 0 || commonTabs.indexOf(item.z) >= 0) {
					common.push(item);
				} else {
					current.push(item);
				}
			});

			data.scene = flows._selected;
			logger.info('Saving flows for scene: ' + flows._selected);

			flows[flows._selected] = current;
			flows.common = common;

			fs.writeFileSync(flowsPath, JSON.stringify(flows));
		},
		changeFlow: function(newId) {
			flows._selected = newId;
			logger.debug('Changing flows to scene: ' + newId);
			fs.writeFileSync(flowsPath, JSON.stringify(flows));
			events.emit('changed', newId);
			eventBus.emit('flows', 'changed', newId);
		}
	};

	Object.defineProperty(svc, 'current', function() { return flows._selected; });

	return svc;
}


module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;
