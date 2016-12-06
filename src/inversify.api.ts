import { ContainerModule, interfaces } from 'inversify';

import { WebApi } from './api/web';
import { WebDependencies } from './api/web/dependencies';

export const apiModule = new ContainerModule(bind => {
  bind<Homenet.IWebDependencies>("IWebDependencies").to(WebDependencies);
  bind<Homenet.IWebApi>("IWebApi").to(WebApi);
});
