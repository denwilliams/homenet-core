import * as core from './index';
import { init as initCore, plugin, registerStats } from './index';
import * as moduleFinder from 'module-finder';
import * as RED from 'node-red';
import { join as joinPath } from 'path';

let configFilename;
if (process.argv.length > 2) {
  configFilename = process.argv[process.argv.length - 1];
  if (configFilename[0] !== '/') {
    configFilename = joinPath(process.cwd(), configFilename);
  }
} else {
  configFilename = '/etc/homenet4/config.json'
}

console.log('Loading with config ==> ' + configFilename);
const config = require(configFilename);

@plugin()
class ConsoleStats implements Homenet.IStatsTarget {
  constructor() {
  }

  gauge(id: string, value: number) : void {
    console.log('guage:', id, value);
  }

  counter(id: string, increment?: number) : void {
    console.log('counter:', id, increment);
  }
}

registerStats(ConsoleStats);
const runtime = initCore(RED, config);

moduleFinder({
  local: true,
  global: true,
  recursive: true, // to support @homenet/* plugins
  filter: {
    keywords: {$in: ['homenet4-plugin']}
  }
})
.then(modules => {
  modules.forEach(m => {
    console.log(`Found ${m.pkg.name} v${m.pkg.version}`);

    let loadedModule = require(m.path.replace('/package.json', ''));
    if (typeof loadedModule === 'function') {
      loadedModule = loadedModule(core);
    }
    m.pkg.homenet4.plugins.forEach(pluginName => {
      const plugin = loadedModule[pluginName];
      console.log(`Loading plugin ${m.pkg.name} -> ${pluginName}`);
      runtime.loadPlugin(plugin);
    });
  });

  runtime.start();
})
.catch(err => {
  console.error(err.stack);
  process.exit(1);
});
