import { injectable, inject } from "inversify";
import ClassTypeManager = require('../utils/class-type-manager');
import { TriggerSensor } from './models/trigger-sensor';

const CLASS_ID = 'sensor';

@injectable()
export class SensorManager extends ClassTypeManager<Homenet.ISensor> implements Homenet.ISensorManager {
  // private _classes: Homenet.IClassesManager;
  private _triggers: Homenet.ITriggerManager;
  private _values: Homenet.IValuesManager;
  private _presence: Homenet.IPresenceManager;


  constructor(
        @inject('IClassesManager') classes: Homenet.IClassesManager,
        @inject('ITriggerManager') triggers: Homenet.ITriggerManager,
        @inject('IValuesManager') values: Homenet.IValuesManager,
        @inject('IPresenceManager') presence: Homenet.IPresenceManager,
        @inject('IConfig') config: Homenet.IConfig,
        @inject('ILogger') logger: Homenet.ILogger) {
      super(CLASS_ID, logger);

      this.addToClasses(classes);

      this._triggers = triggers;
      this._values = values;
      this._presence = presence;
    }

  trigger(sensorId: string) : void {
    this.getInstance(sensorId).trigger();
  }

  public createTriggerSensor(
                          instanceId: string,
                          opts: {timeout: number, zone: string},
                          triggers: Homenet.ITriggerManager,
                          presence : Homenet.IPresenceManager,
                          values: Homenet.IValuesManager)
                          : Homenet.ISensor {
    return new TriggerSensor(instanceId, opts, this._triggers, this._presence, this._values);
  }

  protected onAddInstance(instance: Homenet.Func<Homenet.ISensor>, instanceId: string, typeId: string, opts: any) : void {
    this._triggers.add(CLASS_ID, instanceId);
  }
}
