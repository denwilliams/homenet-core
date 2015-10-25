var RED = require('node-red');
var when = require('when');
var fs = require('fs');

function InProcNodeRed(nodeRedContext, nodeRedFlows, nodeRedStorage, webServer, nodes, userConfig, logger) {

  var config = {
    nodeRedData: userConfig.dataPath ||
      __dirname + '/../../flows/',
    nodeRedNodes: __dirname + '/../../nodes/',
    userDir: __dirname + '/../../nodes/',
    nodeRedUrl: '/edit/rules',
    nodeRedApiUrl: '/rulesapi'
  };

  var initialFlow = 'main.flow';
  var evt = null;

  // Create the settings object
  var settings = {
    // functionGlobalContext: {
    //   services: services,
    //   logger: services.logger.getLogger('rules'),
    //   events: evt
    // },
    paletteCategories: ['homenet', 'function', 'input', 'output'],
    functionGlobalContext: nodeRedContext,
    storageModule: nodeRedStorage,
    httpAdminRoot: config.nodeRedUrl,
    httpNodeRoot: config.nodeRedApiUrl,
    userDir: config.nodeRedData,
    nodesDir: config.nodeRedNodes,
    flowFile: config.nodeRedData + initialFlow,
    adminAuth: {
      type: 'credentials',
      users: [
        {
          username: 'admin',
          password: '$2a$08$Hfo8ZCH3gzErDmH3piUL/.WsihVmHo8pHD3SKpoZ9XC8ip/HwrhVC',
          permissions: '*'
        }
      ]
    },

    set: function(what, data) {
      // console.log('set', what, data);
      return when.resolve();
    }
  };


  // Initialise the runtime with a server and settings
  RED.init(webServer.server,settings);

  // Serve the editor UI from /red
  webServer.app.use(settings.httpAdminRoot,RED.httpAdmin);

  // Serve the http nodes UI from /api
  webServer.app.use(settings.httpNodeRoot,RED.httpNode);

  function TestNode(n) {
    RED.nodes.createNode(this,n);
  }
  // RED.nodes.add

  // Start the runtime
  RED.start()
    .then(function() {
      console.log('Done!');

      if (nodes) {
        nodes.forEach(function(node) {
          RED.nodes.addNode(node);
        });
      } else {
        logger.warn('No nodes provided. Did you miss something in config?');
      }

      nodeRedFlows.on('changed', function() {
        reload();
      });
    });

  return {
    reload: reload
  };

  // ---private---

  function reload() {
    RED.nodes.stopFlows();
    setTimeout(function() {
      try {
        RED.nodes.loadFlows();
      } catch(err) {
        logger.error(err.message, err.stack);
      }
    },1000);
  }
}

module.exports = exports = InProcNodeRed;
