import { injectable, inject } from 'inversify';
import { ClassTypeManager } from '../utils/class-type-manager';

const CLASS_ID = 'sensor';

@injectable()
export class SensorManager extends ClassTypeManager<Homenet.ISensor> implements Homenet.ISensorManager {
  constructor(
        @inject('IClassesManager') classes: Homenet.IClassesManager,
        @inject('ITriggerManager') private triggers: Homenet.ITriggerManager,
        @inject('IValuesManager') private values: Homenet.IValuesManager,
        @inject('IPresenceManager') private presence: Homenet.IPresenceManager,
        @inject('IConfig') config: Homenet.IConfig,
        @inject('ILogger') logger: Homenet.ILogger) {
      super(CLASS_ID, classes, logger);
    }

  protected onAddInstance(sensor: Homenet.ISensor, instanceId: string, typeId: string, opts: any) : void {
    let sensorPresence;
    const guid = `sensor.${instanceId}`;

    if (sensor.isTrigger || sensor.isToggle) {
      const zoneId = sensor.opts.zoneId || sensor.opts.zone;

      const parent = zoneId
        ? `zone.${zoneId}`
        : undefined;

      sensorPresence = this.presence.add(
        guid,
        { category: 'sensor', timeout: sensor.opts.timeout, parent, name: guid }
      );
    }

    if (sensor.isTrigger) {
      // allow trigger
      let trigger = this.triggers.add(CLASS_ID, instanceId);
      sensor.on('trigger', () => {
        trigger.trigger();
      });
      trigger.onTrigger(() => {
        if (sensorPresence) sensorPresence.bump();
      });
    }
    if (sensor.isToggle && sensorPresence) {
      // allow toggle
      sensor.on('active', isActive => {
        if (isActive) sensorPresence.set();
        else sensorPresence.clear();
      });
    }
    if (sensor.isValue) {
      // allow values
      let valueStore = this.values.addInstance(CLASS_ID, instanceId);
      sensor.on('value', (key: string, value: any) => {
        valueStore.set(key, value);
      });
    }
  }
}
