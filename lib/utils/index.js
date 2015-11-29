/**
 * Helpers for shared functionality. Returns a {@link module:utils.Utils|Utils} instance.
 * @module utils
 * @see ClassTypeManager
 * @see module:utils.Utils
 */

var IMPLEMENTS = 'utils';
var INJECT = ['logger'];

function factory(services) {
  var classes = services.classes;
  var logger = services.logger.getLogger('utils');
  logger.info('Starting '+IMPLEMENTS+' module');
  logger = null;

  /**
   * @class Utils
   * @memberOf module:utils
   */
  return {
    lazySingleton: require('./lazy-singleton.ts'),
    /**
     * The {@link ClassTypeManager} contructor.
     * @member {function} module:utils.Utils#ClassTypeManager
     */
    ClassTypeManager: require('./class-type-manager.ts')
  };
}



factory.$inject = INJECT;
factory.$implement = IMPLEMENTS;
module.exports = exports = factory;

