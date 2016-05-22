// import * as NodeRED from 'node-red-interfaces';
// import { TypeBinding, Kernel, TypeBindingScopeEnum } from 'inversify';
//
// import NodeREDLauncher = require('./nodered/launcher');
// import NodeREDContext = require('./nodered/context');
// import CustomStorage = require('./nodered/custom-storage');
// import CustomFlows = require('./nodered/custom-flows');
//
// export function bindModules(kernel: Kernel) : void {
//   console.log('Binding NodeRED modules');
//   kernel.bind(new TypeBinding<INodeREDLauncher>('INodeREDLauncher', NodeREDLauncher));
//   kernel.bind(new TypeBinding<INodeREDContext>('INodeREDContext', NodeREDContext));
//   kernel.bind(new TypeBinding<NodeRED.IStorageApi>('NodeRED.IStorageApi', CustomStorage));
//   kernel.bind(new TypeBinding<NodeRED.IRuntimeFlowConfig>('NodeRED.IRuntimeFlowConfig', CustomFlows));
// };
