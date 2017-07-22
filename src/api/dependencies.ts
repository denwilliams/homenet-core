/// <reference path="../interfaces.d.ts"/>

import {injectable, inject} from 'inversify';

@injectable()
export class WebDependencies implements Homenet.IWebDependencies {
  constructor(
    @inject('ILogger') public logger: Homenet.ILogger,
    @inject('IConfig') public config: Homenet.IConfig,
    @inject('ITriggerManager') public triggers: Homenet.ITriggerManager,
    @inject('ISwitchManager') public switches: Homenet.ISwitchManager,
    @inject('ICommandManager') public commands: Homenet.ICommandManager,
    @inject('IStateManager') public states: Homenet.IStateManager,
    @inject('ISunlight') public sunlight: Homenet.ISunlight,
    @inject('ISensorManager') public sensors: Homenet.ISensorManager,
    @inject('IPresenceManager') public presence: Homenet.IPresenceManager,
    @inject('IMacroManager') public macros: Homenet.IMacroManager,
    @inject('ILockManager') public locks: Homenet.ILockManager,
    @inject('ILightsManager') public lights: Homenet.ILightsManager,
    @inject('ISceneManager') public scene: Homenet.ISceneManager,
    @inject('IValuesManager') public values: Homenet.IValuesManager,
    @inject('IZoneManager') public zones: Homenet.IZoneManager,
    @inject('IAuthorizer') public authorization: Homenet.IAuthorizer,
    @inject('IClassesManager') public classesManager: Homenet.IClassesManager
    // utils: Utils
  ) {
  }
}
