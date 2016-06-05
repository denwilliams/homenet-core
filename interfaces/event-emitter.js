/**
 * @interface EventEmitter
 */

/**
 * Binds a listener (event handler) to an event
 * @method EventEmitter#on
 * @param {string} type - the name of the event
 * @param {Function} listener - event handler
 * @param {Object} handler.e - event args
 */

/**
 * Emits or fires an event
 * @method EventEmitter#emit
 * @param {string} eventName - the name of the event
 * @param {Mixed} arg - event arg
 */

/**
 * Removes a listener / event handler currently bound to an event
 * @method EventEmitter#removeListener
 * @param {string} type - the name of the event
 * @param {Function} listener - event handler
 */

/**
 * Removes every listener / event handler currently bound to an event
 * @method EventEmitter#removeAllListeners
 * @param {string} type - the name of the event
 */
