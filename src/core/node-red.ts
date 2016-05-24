/// <reference path="../interfaces.d.ts"/>

///// <reference path="../../node_modules/node-red-contrib-scenes/scenes.d.ts"/>

// const RED = require('node-red');
import {join} from 'path';
import {inject, injectable} from 'inversify';
import {createServer} from 'http';
import * as express from 'express';

// import { Homenet } from '../interfaces.d.ts';

// import NodeRedScenes = require('node-red-contrib-scenes');
import nrScenes = require('node-red-contrib-scenes');

@injectable()
export class NodeRed implements Homenet.INodeRed {

  private _logger: Homenet.ILogger;
  private _services: Homenet.IServiceContext;
  private _sceneManager: any;
  private _RED: any;
  private _config = {
    nodesDir: null, // join(__dirname, '../nodes/'),
    userDir: join(__dirname, '../../data/'),
    initialFlow: 'day',
    redUrl: '/',
    redApiUrl: '/redapi'
  };

  private _switches: Homenet.ISwitchManager;

  constructor(
    @inject('ILogger') logger: Homenet.ILogger,
    @inject('IConfig') config: Homenet.IConfig,
    @inject('IServiceContext') services: Homenet.IServiceContext,
    @inject('ISwitchManager') switches: Homenet.ISwitchManager,
    @inject('RED') RED: any) {
  // constructor(logger: ILogger, RED: any) {
    this._logger = logger;
    this._services = services;
    this._switches = switches;

    if (config.dataPath) this._config.userDir = config.dataPath;
    this._RED = RED;
    this._sceneManager = new nrScenes.SceneManager();
  }

  start() : void {
    this._logger.info('Starting Node RED');
    const app = express();
    const server = createServer(app);
    server['test'] = 'this';

    const globalContext = {
      switches: this._switches,
      services: this._services
    };

    // server.listen(1881, () => { console.log('LISTENING 1880'); });
    nrScenes.start(this._RED, {config: this._config, globalContext, sceneManager: this._sceneManager, logger: this._logger, port: 1880, server, app});
  }

  getSceneManager() : any {
    return this._sceneManager;
  }
}
