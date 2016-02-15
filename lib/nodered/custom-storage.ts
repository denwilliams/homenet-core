/// <reference path="../../typings/node-red/node-red.d.ts"/>
// /// <reference path="../../../typings/when/when.d.ts"/>

/**
 * Custom storage module for Node-RED
 * @module nodeRedStorage
 */

import when = require('when');
import * as NodeRED from 'node-red-interfaces';

class CustomStorage implements NodeRED.IStorageApi {

  private _nodeRedFlows : any;

  constructor(nodeRedFlows: any) {
    this._nodeRedFlows = nodeRedFlows;
  }

	init(settings) {
		return when.resolve();
	}

	getFlows() {
		return when.resolve(this._nodeRedFlows.getCurrentFlow());
	}

	saveFlows(flows) {
		return when.resolve(this._nodeRedFlows.saveCurrentFlow(flows));
	}

	getCredentials() {
		return when.resolve({});
	}

	saveCredentials(credentials: NodeRED.ICredentials) : When.Promise<any> {
		console.log(credentials);
    return null;
	}

	getSettings() {
		return when.resolve({});
	}

	saveSettings(settings: NodeRED.ISettings) : When.Promise<any> {
		console.log(settings);
    return null;
	}

	getAllFlows() {
		return when.resolve([]);
	}

	getFlow(fn) {
		return when.reject(new Error());
	}

	saveFlow(fn, data) {
		console.log(fn, data);
	}

  getSessions() : When.Promise<NodeRED.ISessions> {
    return null;
  }

  saveSessions(sessions: NodeRED.ISessions) : When.Promise<any> {
    return null;
  }

	getLibraryEntry(type, path) {

	}

	saveLibraryEntry(type, path, meta, body) {
		console.log(type, path, meta, body);
	}
}

export = CustomStorage;
