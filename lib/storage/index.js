/**
 * Storage manager allows for persisting objects and values in a key value store.
 * Returns a {@link StorageManager} instance.
 * @module storage
 */
module.exports = exports = require('./factory');
exports.$implements = 'storage';
exports.$inject = ['logger', 'config'];
