module.exports = exports = factory;
exports.$implements = 'storage';
exports.$inject = ['logger', 'config'];





var redis = require('redis'),
    Q = require('q'),
    options = {},
    client = redis.createClient(/*6379, '127.0.0.1', options*/),
    //client = redis.createClient(6379, 'homenet.local', options),
    redisGet = Q.nbind(client.get, client),
    redisSet = Q.nbind(client.set, client);

    // if you'd like to select database 3, instead of 0 (default), call
    // client.select(3, function() { /* ... */ });

function factory(services) {
  var config = services.config;
  var logger = services.logger.getLogger('storage');

  function set(key, value) {
    logger.debug('Storage: setting ' + key);
    return redisSet(key, JSON.stringify(value));
  }

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
