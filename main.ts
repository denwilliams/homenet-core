/// <reference path="./interfaces/interfaces.d.ts"/>
/// <reference path="./typings/node/node.d.ts"/>
/// <reference path="./typings/es6-promise/es6-promise.d.ts"/>

require('source-map-support').install();

// const ioc = require('async-ioc');

// import * as fs from 'fs';
// import * as path from 'path';

// function run() {
//   try {
//     // var configSvc = require('./config')(config);
//
//     var container = ioc.createContainer()
//       // .debug(true)
//       // .register('config', configSvc)
//       .registerAll(__dirname + '/lib');
//
//     container.register('config', function(services: any) {
//       return require('./test-config.js');
//     }, []);
//
//     container.start('appTest')
//       .catch(err => console.error(err.stack));
//
//   } catch (err) {
//     console.error(err.stack);
//   }
// }
//
// run();

console.log('-------------------------------------')
console.log('| HOMENET                           |')
console.log('-------------------------------------')

import { Kernel } from 'inversify';

import * as apiModules from './lib/api-modules';
import * as coreModules from './lib/core-modules';
import * as utilModules from './lib/util-modules';
import * as nodeRedModules from './lib/nodered-modules';

var kernel = new Kernel();
coreModules.bindModules(kernel);
utilModules.bindModules(kernel);
apiModules.bindModules(kernel);
nodeRedModules.bindModules(kernel);

const app = kernel.resolve<IApp>('app');
console.log(app);
app.start();
