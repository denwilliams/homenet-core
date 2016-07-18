/// <reference path="./interfaces.d.ts"/>

require('reflect-metadata');
require('source-map-support').install();

import { Kernel, KernelModule } from 'inversify';
import { create as createKernel } from './inversify.kernel';
// import {Homenet} from './interfaces.d.ts';
const kernel = createKernel();

import DefaultPlugins = require('./plugins/default');

export {inject as service, injectable as plugin} from 'inversify';
export function registerLogger(CustomLogger: new(...args: any[]) => Homenet.ILogTarget) {
  kernel.bind<Homenet.ILogTarget>('ILogTarget').to(CustomLogger);
}
export function registerStats(CustomStats: new(...args: any[]) => Homenet.IStatsTarget) {
  kernel.bind<Homenet.IStatsTarget>('IStatsTarget').to(CustomStats);
}
export function init(RED: any, config: Homenet.IConfig) : Homenet.IRuntime {
  const externalModule = new KernelModule(bind => {
    console.log('Binding external modules');
    bind<any>("RED").toConstantValue(RED);
    bind<Homenet.IConfig>('IConfig').toConstantValue(config);
  });
  kernel.load(externalModule);

  const logger = kernel.get<Homenet.ILogger>('ILogger');
  const vploader = kernel.get<DefaultPlugins>('DefaultPlugins');
  vploader.addDefault();

  const app = kernel.get<Homenet.IApp>('IApp');
  const plugins = kernel.get<Homenet.IPlugins>('IPlugins');

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
    loadPlugin<T extends Homenet.IPluginLoader>(ctor: Homenet.IPluginCtor<T>) : void {
      kernel.bind<T>(ctor).to(ctor).inSingletonScope();
      const pluginLoader: T = kernel.get<T>(ctor);
      plugins.add(pluginLoader);
    }
  };
}
