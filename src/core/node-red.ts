///// <reference path="../../node_modules/node-red-contrib-scenes/scenes.d.ts"/>

// const RED = require('node-red');
import {join} from 'path';
import {inject, injectable} from 'inversify';
import {createServer} from 'http';
import * as express from 'express';

// import NodeRedScenes = require('node-red-contrib-scenes');
const nrScenes = require('node-red-contrib-scenes');

const config = {
  nodesDir: null, // join(__dirname, '../nodes/'),
  userDir: join(__dirname, '../../data/'),
  initialFlow: 'day',
  redUrl: '/',
  redApiUrl: '/redapi'
};

@injectable()
export class NodeRed implements INodeRed {

  private _logger: ILogger;
  private _sceneManager: any;
  private _RED: any;

  constructor(@inject('ILogger') logger: ILogger, @inject('RED') RED: any) {
  // constructor(logger: ILogger, RED: any) {
    this._logger = logger;
    this._RED = RED;
    this._sceneManager = new nrScenes.SceneManager();
  }

  start() : void {
    this._logger.info('Starting Node RED');
    const app = express();
    const server = createServer(app);
    server['test'] = 'this';
    // server.listen(1881, () => { console.log('LISTENING 1880'); });
    nrScenes.start(this._RED, {config, sceneManager: this._sceneManager, logger: this._logger, port: 1880, server, app});
  }

  getSceneManager() : any {
    return this._sceneManager;
  }
}
