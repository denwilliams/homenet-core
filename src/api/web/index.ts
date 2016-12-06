/// <reference path="../../interfaces.d.ts"/>

import WebApiDependencies = require('./dependencies');
import express = require('express');
import cors = require('cors');
import bodyParser = require('body-parser');

// import { Homenet } from '../../interfaces.d.ts';

import * as geohopper from './routes/geohopper';
// import * as webhooks from './routes/webhooks';
import * as v1 from './routes/v1/index';
import {injectable, inject} from 'inversify';

@injectable()
export class WebApi implements Homenet.IWebApi {

  public app: express.Router;

  constructor(@inject('IWebDependencies') webApiDependencies: Homenet.IWebDependencies) {
    const app : express.Express
      = this.app
      = express();

    app.use(cors());
    app.use(bodyParser.json({strict: false}));
    app.use('/geohopper', geohopper.createRouter(webApiDependencies));
    app.use('/v1', v1.createRouter(webApiDependencies));
  }
}
