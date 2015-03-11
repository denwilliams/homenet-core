var IMPLEMENTS = 'media';
var INJECT = ['logger', 'config'];

var http = require('http');
var EventEmitter = require('events').EventEmitter;

function factory(services) {
  var config = services.config;
  var logger = services.logger.getLogger('locks');
  var media = new EventEmitter();
  var types = {};

  media.addType = function(typeId, type) {
    types[typeId] = type;
    type.on('stateChanged', function(state) {
      // propigate state event
      media.emit('stateChanged', state);
    });
  };

  bindDevices();

  return media;

  function bindDevices() {
    var devices = (config.media && config.media.devices) || [];
    config.media.devices.forEach(function (d) {
      var device = {
        getPlaylists: getPlaylists.bind(null, d.type, d.host, d.port),
        playPlaylist: playPlaylist.bind(null, d.type, d.host, d.port)
      };
      media[d.id] = device;
    });
  }

  function getPlaylists(typeId, host, port) {
    return types[typeId].getPlaylists(host, port);
  }

  function playPlaylist(typeId, host, port, playlist) {
    types[typeId].playPlaylist(host, port, playlist);
  }
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;
