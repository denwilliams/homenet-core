import {inject, injectable} from 'inversify';
// import {Homenet} from '../interfaces.d.ts';

@injectable()
export class App implements Homenet.IApp {
  private _config: Homenet.IConfig;
  private _logger: Homenet.ILogger;
  private _webServer: Homenet.IWebServer;
  private _nodeRed: Homenet.INodeRed;
  private _plugins: Homenet.IPlugins;
  private _instLdr: Homenet.IInstanceLoader;

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

    this._logger = logger;
    this._config = config;
    this._webServer = webServer;
    this._nodeRed = nodeRed;
    this._plugins = plugins;
    this._instLdr = instLdr;
  }

  start() : void {
    this._logger.info('Starting');
    this._plugins.loadAll();
    this._instLdr.loadInstances(this._config);
    this._webServer.start();
    this._nodeRed.start();
  }

}
