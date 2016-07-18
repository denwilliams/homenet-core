import { injectable, inject } from "inversify";
import { ClassTypeManager } from '../utils/class-type-manager';
// import { TriggerSensor } from './models/trigger-sensor';

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

  // public trigger(sensorId: string) : void {
  //   this.getInstance(sensorId).trigger();
  // }

  // public createTriggerSensor(
  //                         instanceId: string,
  //                         opts: {timeout: number, zone: string},
  //                         triggers: Homenet.ITriggerManager,
  //                         presence : Homenet.IPresenceManager,
  //                         values: Homenet.IValuesManager)
  //                         : Homenet.ISensor {
  //   return new TriggerSensor(instanceId, opts, this._triggers, this._presence, this._values);
  // }

  protected onAddInstance(instanceFn: Homenet.Func<Homenet.ISensor>, instanceId: string, typeId: string, opts: any) : void {
    // const valueOnly = typeId.endsWith('value');
    // const triggerOnly = typeId.endsWith('trigger');
    // const toggleOnly = typeId.endsWith('toggle');

    const sensor = instanceFn();

    let sensorPresence = null;
    const guid = `sensor.${instanceId}`;
    if (sensor.isTrigger || sensor.isToggle) {
      const zoneId = sensor.opts.zoneId;
      const parent : string = zoneId ? `zone.${zoneId}` : null;
      sensorPresence = this._presence.add(
        guid,
        { category: 'sensor', timeout: sensor.opts.timeout, parent, name: guid }
      );
    }

    if (sensor.isTrigger) {
      // allow trigger
      let trigger = this._triggers.add(CLASS_ID, instanceId);
      sensor.on('trigger', () => {
        trigger.trigger();
      });
      trigger.onTrigger(() => {
        sensorPresence.bump();
      });
    }
    if (sensor.isToggle) {
      // allow toggle
      sensor.on('active', isActive => {
        if (isActive) sensorPresence.set();
        else sensorPresence.clear();
      });
    }
    if (sensor.isValue) {
      // allow values
      let valueStore = this._values.addInstance(CLASS_ID, instanceId);
      sensor.on('value', (key: string, value: any) => {
        valueStore.set(key, value);
      });
    }
  }
}
