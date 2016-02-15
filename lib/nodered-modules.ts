/// <reference path="../interfaces/interfaces.d.ts"/>
import * as NodeRED from 'node-red-interfaces';
import { TypeBinding, Kernel, TypeBindingScopeEnum } from 'inversify';

import NodeREDLauncher = require('./nodered/launcher');
import NodeREDContext = require('./nodered/context');
import CustomStorage = require('./nodered/custom-storage');
import CustomFlows = require('./nodered/custom-flows');

export function bindModules(kernel: Kernel) : void {
  kernel.bind(new TypeBinding<INodeREDLauncher>('nodeRed', NodeREDLauncher));
  kernel.bind(new TypeBinding<INodeREDContext>('nodeRedContext', NodeREDContext));
  kernel.bind(new TypeBinding<NodeRED.IStorageApi>('nodeRedStorage', CustomStorage));
  kernel.bind(new TypeBinding<NodeRED.IRuntimeFlowConfig>('nodeRedFlows', CustomFlows));
};
