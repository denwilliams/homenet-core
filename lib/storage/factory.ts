/// <reference path="../../interfaces/interfaces.d.ts" />

import StorageManager = require('./storage-manager.ts');

function factory(services: any) {
  var config : Config = services.config;
  var logger : Logger = services.logger.getLogger('storage');
  return new StorageManager(config, logger);
}

export = factory;