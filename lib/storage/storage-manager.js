var redis = require('redis'),
    Q = require('q');

    // if you'd like to select database 3, instead of 0 (default), call
    // client.select(3, function() { /* ... */ });

/**
 * Storage manager allows for persisting and retrieving of key values
 * @param {Config} config - configuration
 * @param {Logger} logger - logger instance
 */
function StorageManager(config, logger) {
  var options = {},
    client = redis.createClient(/*6379, '127.0.0.1', options*/),
    //client = redis.createClient(6379, 'homenet.local', options),
    redisGet = Q.nbind(client.get, client),
    redisSet = Q.nbind(client.set, client);


  /**
   * Sets a value in the store
   * @method StorageManager#set
   * @async
   * @param {string} key   - the key of the value to set
   * @param {Object} value - the value to store
   * @return {Promise} promise that resolves when complete
   */
  function set(key, value) {
    logger.debug('Storage: setting ' + key);
    return redisSet(key, JSON.stringify(value));
  }

  /**
   * Gets a value from the store
   * @method StorageManager#set
   * @param  {string} key - the key of the value to get
   * @return {Promise<Object>} the stored value (if any)
   */
  function get(key) {
    logger.debug('Storage: getting ' + key);
    return redisGet(key)
    .then(function(res) {
        return JSON.parse(res);
    });
  }

  client.on("error", function (err) {
    logger.error("Error " + err);
  });

  return { set: set, get: get };
}

module.exports = exports = StorageManager;