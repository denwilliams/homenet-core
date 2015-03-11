var IMPLEMENTS = 'notifications';
var INJECT = ['logger'];

function factory(services) {
  var notifications = services.notifications;
  var logger = services.logger.getLogger('notifications');

  var notifiers = [
    // require('./logger-notifier')
  ];

  return {
    /**
     * Registers a new notifier type
     * @param  {Notifier} notifier - the notifier to add
     */
    register: function(notifier) {
      notifiers.push(notifier);
    },
    /**
     * Sends a notification
     * @param  {String} severity  - The severity of the message [info|notice|alert|alarm]
     * @param  {String} msgTxt    - The message as text
     * @param  {String} [msgHtml] - The message as html    
     */
    send: function(severity, msgTxt, msgHtml) {
      notifiers.forEach(function(notifier) {
        notifier(severity, msgTxt, msgHtml);
      });
    }
  };
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;