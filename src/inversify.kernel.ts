import { inject, injectable, Container, interfaces as inversify } from 'inversify';

import { apiModule } from "./inversify.api";
import { coreModule } from "./inversify.core";
import { pluginsModule } from "./inversify.plugins";
import { utilsModule } from "./inversify.utils";

export function create(): Container {
  const kernel: Container = new Container();
  kernel.load(apiModule, coreModule, pluginsModule, utilsModule);

  @injectable()
  class ServiceContext implements Homenet.IServiceContext {
    get<T>(type: string) : T {
      return kernel.get<T>(type);
    }
  }
  kernel.bind<Homenet.IServiceContext>('IServiceContext').to(ServiceContext);
  return kernel;
}
