import {inject, injectable} from 'inversify';
// import {Homenet} from '../interfaces.d.ts';

@injectable()
class App implements Homenet.IApp {

  private _logger: Homenet.ILogger;
  private _webServer: Homenet.IWebServer;
  private _nodeRed: Homenet.INodeRed;

  constructor(
        @inject('IConfig') config: Homenet.IConfig,
        @inject('ILogger') logger: Homenet.ILogger,
        @inject('IWebServer') webServer: Homenet.IWebServer,
        @inject('INodeRed') nodeRed: Homenet.INodeRed,
        @inject('IPlugins') plugins: Homenet.IPlugins,
        @inject('IInstanceLoader') instLdr: Homenet.IInstanceLoader) {
    if (!config) throw new Error('Config must be provided');
    if (!logger) throw new Error('Logger must be provided');
    if (!webServer) throw new Error('WebServer must be provided');
    if (!plugins) throw new Error('Plugins must be provided');
    if (!instLdr) throw new Error('Instance Loader must be provided');

    instLdr.loadInstances(config);
    plugins.loadAll();

    this._logger = logger;
    this._webServer = webServer;
    this._nodeRed = nodeRed;
    this._webServer.start();
  }

  start() : void {
    this._logger.info('Starting');
    this._webServer.start();
    this._nodeRed.start();
  }

}

export = App;
