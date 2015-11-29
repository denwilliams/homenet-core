/**
 * Creates a lazy loading singleton
 * @method
 * @memberOf module:utils.Utils#
 * @param  {function} factory
 * @param  {Array<*>} [argsArray]
 * @param  {Object} [thisArg]
 * @return {function} lazy loading singleton factory
 */
function lazySingleton(factory: Function, args: any, thisArg: Object) {
  var instance;
  return function() {
    if (!instance) {
      instance = factory.apply(thisArg, args);
    }
    return instance;
  };
}

export = lazySingleton;
