/// <reference path="../../interfaces.d.ts"/>

import WebApiDependencies = require('../dependencies');
import express = require('express');
import cors = require('cors');
import {injectable, inject} from 'inversify';
import { handler } from './handler';

@injectable()
export class GraphQLApi implements Homenet.IApi {
  public app: express.Router;

  constructor(@inject('IWebDependencies') webApiDependencies: Homenet.IWebDependencies) {
    const app : express.Express
      = this.app
      = express();

    app.use(cors());
    app.use('/', handler(webApiDependencies));
  }
}
