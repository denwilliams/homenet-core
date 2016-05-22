declare namespace Homenet {
  export namespace Api {
    export interface IWebDependencies {
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
    }
  }
}
