/// <reference path="./interfaces.d.ts"/>

import { IKernel, IKernelModule } from "inversify";
// import { Homenet } from './interfaces.d.ts';

import { WebApi } from './api/web/index';
import { WebDependencies } from './api/web/dependencies';

export const apiModule: IKernelModule = (k: IKernel) => {
  console.log('Binding API modules');
  k.bind<Homenet.IWebDependencies>("IWebDependencies").to(WebDependencies);
  k.bind<Homenet.IWebApi>("IWebApi").to(WebApi);
};

// import * as NodeRED from 'node-red-interfaces';
// import { TypeBinding, Kernel, TypeBindingScopeEnum } from 'inversify';

// export function bindModules(kernel: Kernel) : void {
//   kernel.bind(new TypeBinding<WebApiDependencies>('WebApiDependencies', WebApiDependencies));
//   kernel.bind(new TypeBinding<IWebApi>('IWebApi', WebApi));
// };
