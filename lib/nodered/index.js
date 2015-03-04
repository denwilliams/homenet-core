var $implements = 'nodeRed';
var $inject = ['config', 'logger', 'nodes', 'webServer', 'nodeRedStorage', 'nodeRedUserModules', 'nodeRedContext', 'nodeRedFlows'];

var RED = require('node-red');
var when = require('when');
var fs = require('fs');

function factory(services) {
  var webServer = services.webServer;
  var nodes = services.nodes;

  var userConfig = services.config;
  var logger = services.logger.getLogger('nodered');

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
    paletteCategories: ['homenet-input', 'homenet-output', 'function', 'input', 'output'],
    functionGlobalContext: services.nodeRedContext,
    storageModule: services.nodeRedStorage,
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
          password: '$2a$08$NMdJ1M5BhHZy/Vnr3izpTu1VRv9uXiAVC0i2Ba/HdvjMstKV41YUO',
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

      nodes.forEach(function(node) {
        RED.nodes.addNode(node);
      });

      services.nodeRedFlows.on('changed', function() {
        reload();
      });

      // RED.nodes.addNode(__dirname + '/../../plugins/testmodule/node-red/blah.js');
      // var x = {
      //   module: 'node-red',
      //   types:[ 'mqtt in', 'mqtt out', 'mqtt-broker' ]
      // };
      // RED.comms.reportRemovedModules([x]);

      // RED.on('type-registered', function(d) {
      //   console.log(d);
      // });

    });


  setTimeout(function() {

    // console.log('=========================================');
    // console.log('=========================================');
    // console.log('=========================================');
    // console.log('=========================================');
    // console.log('=========================================');
    // console.log('=========================================');

    // RED.nodes.stopFlows();
    // RED.nodes.loadFlows();

    // console.log('=========================================');
    // console.log('=========================================');
    // console.log('=========================================');
    // console.log('=========================================');
    // console.log('=========================================');
    // console.log('=========================================');

    // console.log('adding test node', RED.nodes);

    
    // console.log(RED.nodes.getNodeList());
    // console.log(RED.nodes.getModuleList());

    // console.log('=========================================');
    // // RED.nodes.clearRegistry();
    // console.log('=========================================');


    // console.log(RED.nodes.getNodeList());
    // console.log(RED.nodes.getModuleList());

  },2000);

  // sceneManager.onChanged(function(scene) {
  //   loadScene(scene.scene);
  // });

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



module.exports = exports = factory;
exports.$implements = $implements;
exports.$inject = $inject;
