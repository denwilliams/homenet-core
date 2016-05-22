require('reflect-metadata');
require('source-map-support').install();

import { Kernel, IKernel, IKernelModule } from 'inversify';
import { kernel } from './inversify.kernel';

import DefaultPlugins = require('./plugins/default');

export {inject, injectable as plugin} from 'inversify';

export function init(RED: any) : IRuntime {

  const nodeRedModule: IKernelModule = (k: IKernel) => {
    console.log('Binding Node Red modules');
    k.bind<any>("RED").toConstantValue(RED);
  };
  kernel.load(nodeRedModule);

  const logger = kernel.get<ILogger>('ILogger');

  const vploader = kernel.get<DefaultPlugins>('DefaultPlugins');
  vploader.addDefault();

  const app = kernel.get<IApp>('IApp');
  const plugins = kernel.get<IPlugins>('IPlugins');

  // const lights = kernel.get<ILightsManager>('ILightsManager');
  // const locks = kernel.get<ILockManager>('ILockManager');
  // const switches = kernel.get<ISwitchManager>('ISwitchManager');

  return {
    start() : void {
      logger.info('-------------------------------------------');
      logger.info('==============>>> HOMENET <<<==============');
      logger.info('-------------------------------------------');
      logger.info('Start time:');
      logger.info(new Date());
      logger.info('Version: v' + require('../package.json').version);
      logger.info('-------------------------------------------');

      return app.start();
    },
    get<T>(type: string) : T {
      return kernel.get<T>(type);
    },
    loadPlugin<T extends IPluginLoader>(ctor: IPluginCtor<T>) : void {
      kernel.bind<T>(ctor).to(ctor).inSingletonScope();
      const pluginLoader: T = kernel.get<T>(ctor);
      plugins.add(pluginLoader);
    }
  };
}
