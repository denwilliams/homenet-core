import {inject, injectable} from 'inversify';

@injectable()
class App implements IApp {

  private _logger: ILogger;
  private _webServer: IWebServer;
  private _nodeRed: INodeRed;

  constructor(
        @inject('IConfig') config: IConfig,
        @inject('ILogger') logger: ILogger,
        @inject('IWebServer') webServer: IWebServer,
        @inject('INodeRed') nodeRed: INodeRed,
        @inject('IPlugins') plugins: IPlugins,
        @inject('IInstanceLoader') instLdr: IInstanceLoader) {
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
