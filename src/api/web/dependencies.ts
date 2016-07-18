/// <reference path="../../interfaces.d.ts"/>

import {injectable, inject} from 'inversify';
// import {Homenet} from '../../interfaces.d.ts';

@injectable()
export class WebDependencies implements Homenet.IWebDependencies {

  logger: Homenet.ILogger;
  config: Homenet.IConfig;
  triggers: Homenet.ITriggerManager;
  switches: Homenet.ISwitchManager;
  commands: Homenet.ICommandManager;
  states: Homenet.IStateManager;
  sunlight: Homenet.ISunlight;
  sensors: Homenet.ISensorManager;
  presence: Homenet.IPresenceManager;
  locks: Homenet.ILockManager;
  lights: Homenet.ILightsManager;
  scene: Homenet.ISceneManager;
  zones: Homenet.IZoneManager;
  authorization: Homenet.IAuthorizer;
  values: Homenet.IValuesManager;
  // utils: Utils;


  constructor(
    @inject('ILogger') logger: Homenet.ILogger,
    @inject('IConfig') config: Homenet.IConfig,
    @inject('ITriggerManager') triggers: Homenet.ITriggerManager,
    @inject('ISwitchManager') switches: Homenet.ISwitchManager,
    @inject('ICommandManager') commands: Homenet.ICommandManager,
    @inject('IStateManager') states: Homenet.IStateManager,
    @inject('ISunlight') sunlight: Homenet.ISunlight,
    @inject('ISensorManager') sensors: Homenet.ISensorManager,
    @inject('IPresenceManager') presence: Homenet.IPresenceManager,
    @inject('ILockManager') locks: Homenet.ILockManager,
    @inject('ILightsManager') lights: Homenet.ILightsManager,
    @inject('ISceneManager') scene: Homenet.ISceneManager,
    @inject('IValuesManager') values: Homenet.IValuesManager,
    @inject('IZoneManager') zones: Homenet.IZoneManager,
    @inject('IAuthorizer') authorization: Homenet.IAuthorizer
    // utils: Utils
  ) {
    this.logger = logger;
    this.config = config;
    this.triggers = triggers;
    this.switches = switches;
    this.commands = commands;
    this.states = states;
    this.sunlight = sunlight;
    this.sensors = sensors;
    this.presence = presence;
    this.locks = locks;
    this.lights = lights;
    this.scene = scene;
    this.zones = zones;
    this.values =  values;
    this.authorization = authorization;
    // this.utils = utils;
  }
}
