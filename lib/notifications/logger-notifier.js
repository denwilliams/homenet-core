module.exports = exports = function(logger, msg) {
  logger.info('NOTIFICIATION: ' + msg.topic + ' - ' + msg.text + ' [' + msg.category + ']');
};
