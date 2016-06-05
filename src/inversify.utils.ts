import { IKernel, IKernelModule } from "inversify";

import ClassTypeManager = require('./utils/class-type-manager');

export const utilsModule: IKernelModule = (k: IKernel) => {
  console.log('Binding util modules');
};
