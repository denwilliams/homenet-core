import redis = require('redis');
import Q = require('q');
import {inject, injectable} from 'inversify';

interface RedisGet {
  (key: string) : Q.Promise<string>
}
interface RedisSet {
  (key: string, value: string) : Q.Promise<string>
}

/**
 * Storage manager allows for persisting and retrieving of key values
 * @param {Config} config - configuration
 * @param {Logger} logger - logger instance
 */
@injectable()
export class StorageManager implements Homenet.IStorageManager {

  private _logger: Homenet.ILogger;
  private _config: Homenet.IConfig;
  private _redisGet: RedisGet;
  private _redisSet: RedisSet;

  constructor(
          @inject('IConfig') config: Homenet.IConfig,
          @inject('ILogger') logger: Homenet.ILogger) {
    var options = {};
    this._config = config;
    this._logger = logger;

    var client: redis.RedisClient = redis.createClient(/*6379, '127.0.0.1', options*/);
    // if you'd like to select database 3, instead of 0 (default), call
    // client.select(3, function() { /* ... */ });

    //client = redis.createClient(6379, 'homenet.local', options),
    this._redisGet = Q.nbind<string>(client.get, client);
    this._redisSet = Q.nbind<string>(client.set, client);

    client.on("error", function (err) {
      logger.error("Error " + err);
    });
  }

  /**
   * Sets a value in the store
   * @method StorageManager#set
   * @async
   * @param {string} key   - the key of the value to set
   * @param {Object} value - the value to store
   * @return {Promise} promise that resolves when complete
   */
  set(key: string, value: any) {
    this._logger.debug('Storage: setting ' + key);
    return this._redisSet(key, JSON.stringify(value))
    .then(function(res) { return JSON.parse(res); });
  }

  /**
   * Gets a value from the store
   * @method StorageManager#set
   * @param  {string} key - the key of the value to get
   * @return {Promise<Object>} the stored value (if any)
   */
  get(key: string) : Q.Promise<any> {
    this._logger.debug('Storage: getting ' + key);
    return this._redisGet(key)
    .then(function(res) { return JSON.parse(res); });
  }
}
