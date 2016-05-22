import WebApiDependencies = require('./dependencies');
import express = require('express');
import bodyParser = require('body-parser');

import * as geohopper from './routes/geohopper';
// import * as webhooks from './routes/webhooks';
import * as v1 from './routes/v1/index';
import {injectable, inject} from 'inversify';

@injectable()
export class WebApi implements IWebApi {

  public app: express.Router;

  constructor(@inject('IWebDependencies') webApiDependencies: Homenet.Api.IWebDependencies) {
    const app : express.Express
      = this.app
      = express();

    app.use(bodyParser.json({strict: false}));
    app.use('/geohopper', geohopper.createRouter(webApiDependencies));
    app.use('/v1', v1.createRouter(webApiDependencies));
  }
}
