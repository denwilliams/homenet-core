const DEFAULT_TIMEOUT = 60000;

export type SensorMode = 'toggle' | 'trigger';

/**
  * @class Sensor
  * @abstract
  * @param {string} instanceId - unique ID of this instance
  * @param {Object}      [opts] - options
  * @param {SensorMode}  [opts.mode='toggle'] - trigger|toggle|value.
  *                                 Toggle based sensors are set `true`/`false`.
  *                                 Trigger based sensors are `true` when triggered until a timeout period expires where they become `false`.
  * @param {integer}     [opts.timeout] - timeout period in milliseconds for trigger based sensors.
  * @param {string}      [opts.zone] - the ID of any zone this sensor is a child of
  * @example
  * function MySensor(id) {
  *   Sensor.call(this, id, {mode:'trigger'});
  * }
  * Sensor.extend(MySensor);
  *
  * var sensor = new MySensor(1);
  * sensor.trigger();
  */
export class BaseSensor implements Homenet.ISensor {

  id: string;
  mode: SensorMode;

  private _trigger: Homenet.ITrigger;
  private _values: Homenet.IValueStore;
  private _presence: Homenet.IPresence;

  constructor(
            instanceId: string,
            opts: {mode?: SensorMode, timeout?: number, zone?: string},
            triggers: Homenet.ITriggerManager,
            presence: Homenet.IPresenceManager,
            values: Homenet.IValuesManager) {
    opts = opts || {};
    this.id = instanceId;
    const mode: SensorMode = this.mode = opts.mode || 'toggle';

    if (mode === 'trigger' || mode === 'toggle') {
      var timeout : number = opts.timeout || DEFAULT_TIMEOUT;
      var parentId : string = opts.zone ? 'zone.'+opts.zone : null;
      var sensorPresence = this._presence = presence.add(
        'sensor.'+instanceId,
        {timeout:timeout, category:'sensor', parent:parentId, name: 'sensor.'+instanceId}
      );
    }

    if (mode === 'trigger') {
      var trigger = this._trigger = triggers.add('sensor', instanceId, null);
      trigger.onTrigger(function() {
        sensorPresence.bump();
      });
    } else if (mode === 'value') {
      this._values = values.addInstance('sensor', instanceId);
    }
  }

  // /**
  //  * Extends a class by inheriting Sensor.
  //  * IMPORTANT: must call `Sensor.call(this, id, triggerBased)` in the constructor.
  //  * @param  {function} Constructor - the constructor to extend
  //  */
  // extend(Constructor) {
  //   util.inherits(Constructor, Sensor);
  // };

  /**
   * Triggers this sensor
   */
  trigger() {
    if (!this._trigger) return;
    this._trigger.trigger(true);
  }

  on() {
    if (!this._presence) return;
    this._presence.set();
  }

  off() {
    if (!this._presence) return;
    this._presence.clear();
  }

  set(key, value) {
    if (!this._values) return;
    this._values.set(key, value);
  }

  get(key) {
    if (!this._values) return;
    return this._values.get(key);
  }

  getAll() {
    return this._values.getAll();
  }

  onTrigger(cb: Function) : void {
    if (!this._trigger) return;
    this._trigger.onTrigger(cb);
  }

  removeOnTriggerListener(cb: Function) : void {
    if (!this._trigger) return;
    this._trigger.removeOnTriggerListener(cb);
  }
}
