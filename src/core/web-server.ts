import * as express from 'express';
import * as http from 'http';
import { inject, injectable } from "inversify";

@injectable()
class WebServer implements IWebServer {

  public server: any;
  public app: any;

  // private _logger: ILogger;
  private _port: number;
  private _config: IConfig;

  constructor(
        // @inject('ILogger') logger: ILogger,
        @inject('IConfig') config: IConfig,
        @inject('IWebApi') webApi: IWebApi) {
    // if (!logger) throw new Error('Logger required');
    if (!config) throw new Error('Config required');
    if (!webApi) throw new Error('Web API required');
    if (!webApi.app) throw new Error('Web API application required');

    // this._logger = logger;
  	var app: express.Express = express();

    app.use(basicAuth());

  	app.use('/api', webApi.app);

  	// app.use('/sensor', services.sensors.app);
  	// app.use('/people', services.people.app);
  	app.get('/', redirectToUi);

  	var server: http.Server = this.server =
      http.createServer(app);
  	// services.api.wsApi.init(server);

    this.app = app;
    this._port = config.webServerPort;
    this._config = config;
  }

  start() : void {
    // this._logger.info('Starting web server on port ' + this._port);
    this.server.listen(this._port);
  }

  get config(): IConfig {
      return this._config;
  }
}

export = WebServer;

function redirectToUi(req, res) : void {
	res.redirect('http://homeconsole.me');
}

function basicAuth() {
	return function(req, res, next) : void {
		// TODO: add this
		next();
	};
}
