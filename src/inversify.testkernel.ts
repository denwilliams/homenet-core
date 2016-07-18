require('reflect-metadata');
require('source-map-support').install();

import { injectable, interfaces as inversify } from "inversify";

import { config } from './fixtures';
import { create } from './inversify.kernel';
import { InMemPersistence } from './core/inmem-persistence';
import { DebugStats } from './helpers/debug-stats';

@injectable()
class NullLogger implements Homenet.ILogTarget {
  debug() {}
  info()  {}
  warn()  {}
  error() {}
}

export function createKernel() {
  const kernel: inversify.Kernel = create();
  kernel.bind('IConfig').toConstantValue(config);

  kernel.unbind('IPersistence');
  kernel.bind('IPersistence').to(InMemPersistence).inSingletonScope();

  kernel.unbind('ILogTarget');
  kernel.bind<Homenet.ILogTarget>('ILogTarget').to(NullLogger);

  kernel.bind<Homenet.IStatsTarget>('IStatsTarget').to(DebugStats);
  kernel.bind('RED').toConstantValue({});
  return kernel;
}
