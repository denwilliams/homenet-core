import { ContainerModule, interfaces } from 'inversify';

import { WebApi } from './api/web';
import { GraphQLApi } from './api/graphql';
import { WebDependencies } from './api/dependencies';

export const apiModule = new ContainerModule(bind => {
  bind<Homenet.IWebDependencies>("IWebDependencies").to(WebDependencies);
  bind<Homenet.IApi>("IWebApi").to(WebApi);
  bind<Homenet.IApi>("IGraphQLApi").to(GraphQLApi);
});
