/// <reference path="../../interfaces/interfaces.d.ts"/>

import { Inject } from "inversify";

class App implements IApp {

  private _logger: ILogger;

  constructor(logger: ILogger, webServer: IWebServer) {
    this._logger = logger;
    webServer.start();
  }

  start() : void {
    this._logger.info('Starting');
  }

}

export = App;
