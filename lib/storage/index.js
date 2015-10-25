/**
 * Storage manager allows for persisting objects and values in a key value store.
 * Returns a {@link StorageManager} instance.
 * @module storage
 */

module.exports = exports = factory;
exports.$implements = 'storage';
exports.$inject = ['logger', 'config'];

var StorageManager = require('./storage-manager');

function factory(services) {
  var config = services.config;
  var logger = services.logger.getLogger('storage');
  return new StorageManager(config, logger);
}


//client.set("string key", "string val", redis.print);
// client.hset("hash key", "hashtest 1", "some value", redis.print);
// client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
// client.hkeys("hash key", function (err, replies) {
//     console.log(replies.length + " replies:");
//     replies.forEach(function (reply, i) {
//         console.log("    " + i + ": " + reply);
//     });
//     client.quit();
// });
