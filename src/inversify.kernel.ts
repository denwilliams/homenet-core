import { Kernel, IKernel } from "inversify";

import { apiModule } from "./inversify.api";
import { coreModule } from "./inversify.core";
import { pluginsModule } from "./inversify.plugins";
import { utilsModule } from "./inversify.utils";

export const kernel: IKernel = new Kernel();
kernel.load(apiModule, coreModule, pluginsModule, utilsModule);

class ServiceContext implements Homenet.IServiceContext {
  get<T>(type: string) : T {
    return kernel.get<T>(type);
  }
}
kernel.bind<Homenet.IServiceContext>('IServiceContext').to(ServiceContext);
