import { Kernel, IKernel } from "inversify";

import { apiModule } from "./inversify.api";
import { coreModule } from "./inversify.core";
import { pluginsModule } from "./inversify.plugins";
import { utilsModule } from "./inversify.utils";

export const kernel: IKernel = new Kernel();
kernel.load(apiModule, coreModule, pluginsModule, utilsModule);
