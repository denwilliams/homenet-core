var $implements = 'nodeRed';
var $inject = [
  'config',
  'logger',
  // 'nodes',
  'webServer',
  'nodeRedStorage',
  //'nodeRedUserModules',
  'nodeRedContext',
  'nodeRedFlows'
];

var InProcNodeRed = require('./inproc-nodered');

function factory(services) {
  var webServer = services.webServer;
  var nodes = services.nodes;
  var userConfig = services.config;
  var nodeRedContext = services.nodeRedContext,
    nodeRedFlows = services.nodeRedFlows,
    nodeRedStorage = services.nodeRedStorage;
  var logger = services.logger.getLogger('nodered');

  return new InProcNodeRed(nodeRedContext, nodeRedFlows, nodeRedStorage, webServer, nodes, userConfig, logger);
}



module.exports = exports = factory;
exports.$implements = $implements;
exports.$inject = $inject;
