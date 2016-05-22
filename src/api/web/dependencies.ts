import {injectable, inject} from 'inversify';

@injectable()
export class WebDependencies implements Homenet.Api.IWebDependencies {

  logger: ILogger;
  config: IConfig;
  triggers: ITriggerManager;
  switches: ISwitchManager;
  commands: ICommandManager;
  states: IStateManager;
  sunlight: ISunlight;
  sensors: ISensorManager;
  presence: IPresenceManager;
  locks: ILockManager;
  lights: ILightsManager;
  scene: ISceneManager;
  zones: IZoneManager;
  authorization: IAuthorizer;
  // utils: Utils;


  constructor(
    @inject('ILogger') logger: ILogger,
    @inject('IConfig') config: IConfig,
    @inject('ITriggerManager') triggers: ITriggerManager,
    @inject('ISwitchManager') switches: ISwitchManager,
    @inject('ICommandManager') commands: ICommandManager,
    @inject('IStateManager') states: IStateManager,
    @inject('ISunlight') sunlight: ISunlight,
    @inject('ISensorManager') sensors: ISensorManager,
    @inject('IPresenceManager') presence: IPresenceManager,
    @inject('ILockManager') locks: ILockManager,
    @inject('ILightsManager') lights: ILightsManager,
    @inject('ISceneManager') scene: ISceneManager,
    @inject('IZoneManager') zones: IZoneManager,
    @inject('IAuthorizer') authorization: IAuthorizer
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
    this.authorization = authorization;
    // this.utils = utils;
  }
}
