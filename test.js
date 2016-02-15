require('typescript-require');
var ioc = require('async-ioc');
var Q = require('q');
var fs = require('fs');
var path = require('path');

Q.try(function() {
  // var configSvc = require('./config')(config);

  var container = ioc.createContainer()
    // .debug(true)
    // .register('config', configSvc)
    .registerAll(__dirname + '/lib');

  container.register('config', function(services) {
    return require('./test-config.js');
  }, []);

  return container.start('appTest');
})
.fail(function(err) {
  console.error(err.stack);
});
