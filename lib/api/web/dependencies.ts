class WebApiDependencies {

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
    logger: ILogger,
    config: IConfig,
    triggers: ITriggerManager,
    switches: ISwitchManager,
    commands: ICommandManager,
    states: IStateManager,
    sunlight: ISunlight,
    sensors: ISensorManager,
    presence: IPresenceManager,
    locks: ILockManager,
    lights: ILightsManager,
    scene: ISceneManager,
    zones: IZoneManager,
    authorization: IAuthorizer
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

export = WebApiDependencies;
