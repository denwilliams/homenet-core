/**
 * Helper object to inject common modules. Returns a {@link module:common.Common|Common} instance.
 * @module common
 */

var IMPLEMENTS = 'common';
var INJECT = [
  'logger',
  'config',
  'eventBus',
  // 'notifications',
  'storage'
];

function factory(services) {
  var logger = services.logger.getLogger('common');
  logger.info('Starting '+IMPLEMENTS+' module');
  logger = null;

  return {
    logger: services.logger,
    config: services.config,
    eventBus: services.eventBus,
    notifications: services.notifications,
    storage: services.storage
  };
}

factory.$inject = INJECT;
factory.$implement = IMPLEMENTS;
module.exports = exports = factory;

/**
 * Common modules
 * @class module:common.Common
 */
/**
 * @member {Logger} module:common.Common#logger
 */
/**
 * @member {Config} module:common.Common#config
 */
/**
 * @member {EventBus} module:common.Common#eventBus
 */
/**
 * @member {NotificationManager} module:common.Common#notifications
 */
/**
 * @member {StorageManager} module:common.Common#storage
 */
