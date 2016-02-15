// /// <reference path="../node/node.d.ts"/>
// /// <reference path="../express/express.d.ts"/>
//
// declare module NodeRED {
//   interface IRuntime {
//     // httpAdmin: express.Router;
//     // httpNode: express.Router;
//     // server: http.Server;
//     // auth: NodeREDAuth;
//     // comms: NodeREDComms;
//     // library: NodeREDLibrary;
//     // log: NodeREDLog;
//     // nodes: NodeREDNodes;
//     // settings: NodeREDRuntimeSettings;
//     // util: NodeREDUtil;
//     //
//     // init(server: http.Server, settings: INodeREDSettings);
//     start();
//     stop();
//     version();
//   }
//
//   interface INodeREDUtil {
//
//   }
//
//   interface INodeREDRuntimeSettings {
//
//   }
//
//   interface INodeREDNodes {
//
//   }
//
//   interface INodeREDLog {
//
//   }
//
//   interface INodeREDAuth {
//
//   }
//
//   interface INodeREDComms {
//
//   }
//
//   interface INodeREDLibrary {
//
//   }
//
//   interface IStorageApi {
//     init(settings: INodeREDSettings) : When.Promise<any>;
//     getFlows() : When.Promise<INodeREDRuntimeFlowConfig>;
//     saveFlows(flows: INodeREDFlowConfig) : When.Promise<any>;
//     getCredentials() : When.Promise<INodeREDRuntimeCredentials>;
//     saveCredentials(credentials: INodeREDCredentials) : When.Promise<any>;
//     getSettings() : When.Promise<INodeREDSettings>;
//     saveSettings(settings: INodeREDSettings) : When.Promise<any>;
//     getSessions() : When.Promise<INodeREDSessions>;
//     saveSessions(sessions: INodeREDSessions) : When.Promise<any>;
//     // getLibraryEntry(type,name);
//     // saveLibraryEntry(type,name,meta,body)
//   }
//
//   interface INodeREDSettings {
//
//   }
//
//   interface INodeREDRuntimeFlowConfig {
//
//   }
//
//   interface INodeREDFlowConfig {
//
//   }
//
//   interface INodeREDSessions {
//
//   }
//
//   interface INodeREDRuntimeCredentials {
//
//   }
//
//   interface INodeREDCredentials {
//
//   }
//
// }
//
// declare module 'node-red' {
//
//   // import * as http from 'http';
//   // import * as express from 'express';
//
//   var RED: NodeRED.IRuntime;
//   export = RED;
// }
