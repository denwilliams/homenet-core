// declare module 'node-red-contrib-scenes' {
//   export function createSettings({
//     config?: any, //NodeRedScenes.IConfig,
//     sceneManager?: any, //NodeRedScenes.ISceneManager,
//     storageModule?: any, //SceneStorage,
//     globalContext?: any,
//     flows?: any, //SceneFlows,
//     logger?: any, //NodeRedScenes.ILogger
//   })
//   : {
//     settings: any, //NodeRED.ISettings,
//     flows: any, //SceneFlows,
//     scenes: any, //NodeRedScenes.ISceneManager,
//     config: any, //NodeRedScenes.IConfig,
//     logger: any, //NodeRedScenes.ILogger
//   };
//
//   export function start(
//                         RED: any,// IRuntime,
//                         opts: {
//                           app?: any,//express.Express,
//                           // app?: express.Router,
//                           server?: any, //http.Server,
//
//                           // nodes: NodeRED.INode[],
//
//                           config?: any, //NodeRedScenes.IConfig,
//                           sceneManager?: any, //NodeRedScenes.ISceneManager,
//                           storageModule?: any, //SceneStorage,
//                           globalContext?: any,
//                           flows?: any, //SceneFlows,
//                           logger?: any, //NodeRedScenes.ILogger,
//                           port?: number
//                         } = {});
//
//   export class Starter {}
//
//   export class SceneManager {
//     constructor(initialScene: string = 'default');
//     getCurrentId() : string;
//     set(sceneId: string);
//     onChanged(callback: Function) : void;
//     removeOnChanged(callback: Function) : void;
//   };
// }
