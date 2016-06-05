import {inject, injectable} from 'inversify';

@injectable()
export class GlobalContext implements Homenet.INodeREDContext {
  public logger: Homenet.ILogger;
  public services: Homenet.IServiceContext;
  public switches: Homenet.ISwitchManager;
  public sensors: Homenet.ISensorManager;

  constructor(
    @inject('IServiceContext') services: Homenet.IServiceContext,
    @inject('ISwitchManager') switches: Homenet.ISwitchManager,
    @inject('ISensorManager') sensors: Homenet.ISensorManager,
    @inject('ILogger') logger: Homenet.ILogger) {

    this.logger = logger;
    this.services = services;
    this.switches = switches;
    this.sensors = sensors;
  }
}
