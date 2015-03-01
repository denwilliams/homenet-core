var IMPLEMENTS = 'notifications';
var INJECT = ['logger'];

function factory(services) {
  var notifications = services.notifications;
  var logger = services.logger.getLogger('notifications');

  var notifiers = [
    require('./logger-notifier')
  ];

  return {
    register: function(notifier) {
      notifiers.push(notifier);
    },
    send: function(msg) {
      notifiers.forEach(function(notifier) {
        notifier(msg);
      });
    }
  };
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;