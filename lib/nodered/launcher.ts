/// <reference path="../../typings/node-red/node-red.d.ts"/>

import * as RED from 'node-red';
import * as NodeRED from 'node-red-interfaces';
import when = require('when');
import fs = require('fs');
import * as express from 'express';
import * as http from 'http';
import NodeREDContext = require('./context');

class NodeREDLauncher {

  private _logger : ILogger;
  private _nodes : NodeRED.INode[];
  private _nodeRedFlows : any;
  private _nodeRedStorage : NodeRED.IStorageApi;

  constructor(
    nodeRedContext: INodeREDContext,
    nodeRedFlows: NodeRED.IRuntimeFlowConfig,
    nodeRedStorage: NodeRED.IStorageApi,
    webServer: {server: http.Server, app: express.Router},
    nodes: NodeRED.INode[],
    config: IConfig,
    logger: ILogger
  ) {
    this._logger = logger;
    this._nodes = nodes;
    this._nodeRedFlows = nodeRedFlows;
    this._nodeRedStorage = nodeRedStorage;

    const server: http.Server = webServer.server;
    const app: express.Router = webServer.app;

    const nodeRedData: string = config.dataPath || __dirname + '/../../flows/';
    const nodeRedNodes: string = __dirname + '/../../nodes/';
    const userDir: string = __dirname + '/../../nodes/';
    const nodeRedUrl: string = '/edit/rules';
    const nodeRedApiUrl: string = '/rulesapi';

    const initialFlow : string = 'main.flow';
    var evt = null;

    // Create the settings object
    var settings : any = {
      paletteCategories: ['homenet', 'function', 'input', 'output'],
      functionGlobalContext: nodeRedContext,
      storageModule: nodeRedStorage,
      httpAdminRoot: nodeRedUrl,
      httpNodeRoot: nodeRedApiUrl,
      userDir: nodeRedData,
      nodesDir: nodeRedNodes,
      flowFile: nodeRedData + initialFlow,
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
      },
      verbose: true
    };

    // Initialise the runtime with a server and settings
    RED.init(server, settings);

    // Serve the editor UI from /red
    app.use(settings.httpAdminRoot,RED.httpAdmin);

    // Serve the http nodes UI from /api
    app.use(settings.httpNodeRoot,RED.httpNode);


    // DEBUG:
    //
    // RED.httpNode.__aaa = 'a';
    //
    // function TestNode(n) {
    //   RED.nodes.createNode(this,n);
    // }
    //
    // RED.nodes.add
  }

  start() : when.Promise<any> {
    const self = this;

    // Start the runtime
    return RED.start()
    .then(() => {
      console.log('Done!');
      if (self._nodes) {
        self._nodes.forEach(function(node) {
          RED.nodes.addNode(node);
        });
      } else {
        self._logger.warn('No nodes provided. Did you miss something in config?');
      }

      self._nodeRedFlows.on('changed', function() {
        self.reload();
      });
    });
  }

  reload() : void {
    const self = this;

    RED.nodes.stopFlows();
    setTimeout(() => {
      try {
        RED.nodes.loadFlows();
      } catch(err) {
        self._logger.error(err.message + ' >> ' + err.stack);
      }
    }, 1000);
  }
}

export = NodeREDLauncher;
