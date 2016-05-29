import { BaseSensor } from './base-sensor';

export class TriggerSensor extends BaseSensor {
  constructor(
            instanceId: string,
            opts: {timeout?: number, zone?: string},
            triggers: Homenet.ITriggerManager,
            presence : Homenet.IPresenceManager,
            values: Homenet.IValuesManager) {
    super(instanceId, {
      mode: 'trigger',
      timeout: opts.timeout,
      zone: opts.zone
    }, triggers, presence, values)
  }
}
