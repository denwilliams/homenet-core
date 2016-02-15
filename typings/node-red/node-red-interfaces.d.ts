/// <reference path="../node/node.d.ts"/>
/// <reference path="../express/express.d.ts"/>

declare module 'node-red-interfaces' {

  import * as http from 'http';
  import * as express from 'express';

  export interface IRuntime {
    httpAdmin: express.Router;
    httpNode: express.Router;
    server: http.Server;
    auth: IAuth;
    comms: IComms;
    library: ILibrary;
    log: ILog;
    nodes: INodes;
    settings: IRuntimeSettings;
    util: IUtil;

    init(server: http.Server, settings: ISettings);
    start();
    stop();
    version();
  }

  export interface IUtil {

  }

  export interface IRuntimeSettings {

  }

  export interface INodes {
    addNode(node: any) : void;
    loadFlows() : void;
    stopFlows() : void;
  }

  export interface INode {
    
  }

  export interface ILog {

  }

  export interface IAuth {

  }

  export interface IComms {

  }

  export interface ILibrary {

  }

  export interface IStorageApi {
    init(settings: ISettings) : When.Promise<any>;
    getFlows() : When.Promise<IRuntimeFlowConfig>;
    saveFlows(flows: IFlowConfig) : When.Promise<any>;
    getCredentials() : When.Promise<IRuntimeCredentials>;
    saveCredentials(credentials: ICredentials) : When.Promise<any>;
    getSettings() : When.Promise<ISettings>;
    saveSettings(settings: ISettings) : When.Promise<any>;
    getSessions() : When.Promise<ISessions>;
    saveSessions(sessions: ISessions) : When.Promise<any>;
    // getLibraryEntry(type,name);
    // saveLibraryEntry(type,name,meta,body)
  }

  export interface ISettings {

  }

  export interface IRuntimeFlowConfig {

  }

  export interface IFlowConfig {

  }

  export interface ISessions {

  }

  export interface IRuntimeCredentials {

  }

  export interface ICredentials {

  }

}
