/// <reference path="../interfaces/interfaces.d.ts"/>
import * as NodeRED from 'node-red-interfaces';
import { TypeBinding, Kernel, TypeBindingScopeEnum } from 'inversify';

import WebApi = require('./api/web/index');
import WebApiDependencies = require('./api/web/dependencies');

export function bindModules(kernel: Kernel) : void {
  kernel.bind(new TypeBinding<WebApiDependencies>('webApiDependencies', WebApiDependencies));
  kernel.bind(new TypeBinding<IWebApi>('webApi', WebApi));
};
