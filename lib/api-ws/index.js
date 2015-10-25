var IMPLEMENTS = 'wsApi';
var INJECT = [
  'logger',
  'authorization',
  'config',
  'scene',
  'presence',
  // 'people',
  'eventBus',
  // 'zone',
  'sensors',
  'locks',
  'lights'
];

var socketio = require('socket.io');

function factory(services) {
  var io;
  var logger = services.logger.getLogger('authorization');
  var config = services.config;

  var authorization = services.authorization;
  // var stats = services.stats;
  // 
  
  var svc = {
    init: init
  };
  return svc;

  function init(server) {
    io = socketio(server);

    var broadcast = function(module, event, data) {
      var broadcastEvent = module + ':' + event;
      logger.debug('Broadcasting ' + broadcastEvent, data);
      io.emit(module + ':' + event, data);
    };
    var v1 = require('./v1')(broadcast, services, config);

    io.on('connection', function (socket) {
      // stats.inc('authentications');
      // stats.inc('activeUsers');

      logger.debug('user connected');

      socket.on('disconnect', function () {
        // stats.dec('activeUsers');
        // io.sockets.emit('user disconnected');
        logger.debug('user disconnected');
      });


      v1.bindApi(socket);
    });

    io.set('authorization', function (handshakeData, callback) {
      var query = handshakeData.query || handshakeData._query || {};
      var token = query.token;

      // console.log('handshakeData: ', handshakeData);
      logger.debug('User authenticated with token: ' + token);

      authorization.authorize(token)
        .then(function(authorized) {
          if (!authorized) {
            throw new Error('Not authorized');
          }
          logger.info('User authenticated');
          callback(null, true);
        })
        .fail(function(err) {
          logger.error(err);
          callback(err, false);
        })
        .done();
    });
  }
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;