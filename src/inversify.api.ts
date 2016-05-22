import { IKernel, IKernelModule } from "inversify";

import { WebApi } from './api/web/index';
import { WebDependencies } from './api/web/dependencies';

export const apiModule: IKernelModule = (k: IKernel) => {
  console.log('Binding API modules');
  k.bind<Homenet.Api.IWebDependencies>("IWebDependencies").to(WebDependencies);
  k.bind<IWebApi>("IWebApi").to(WebApi);
};

// import * as NodeRED from 'node-red-interfaces';
// import { TypeBinding, Kernel, TypeBindingScopeEnum } from 'inversify';

// export function bindModules(kernel: Kernel) : void {
//   kernel.bind(new TypeBinding<WebApiDependencies>('WebApiDependencies', WebApiDependencies));
//   kernel.bind(new TypeBinding<IWebApi>('IWebApi', WebApi));
// };
