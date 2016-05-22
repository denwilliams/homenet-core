import util = require('util');
const DEFAULT_TIMEOUT : number = 60000;

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
class SensorImpl implements ISensor {

  public id : string;
  public mode : any;

  private _presence : IPresence;
  private _trigger : ITrigger;
  private _values : IValueStore;

  constructor(instanceId: string, triggers: ITriggerManager, presence: IPresenceManager, values: IValuesManager, opts: any) {
    opts = opts || {};
    this.id = instanceId;
    var mode = this.mode = opts.mode || 'toggle';

    if (mode === 'trigger' || mode === 'toggle') {
      var timeout = opts.timeout || DEFAULT_TIMEOUT;
      var parentId = opts.zone ? 'zone.'+opts.zone : null;
      var sensorPresence : IPresence = this._presence =
        presence.add('sensor.'+instanceId, {timeout:timeout, category:'sensor', parent:parentId});
    }

    if (mode === 'trigger') {
      var trigger : ITrigger = this._trigger =
        triggers.add('sensor', instanceId);

      trigger.onTrigger(function() {
        sensorPresence.bump();
      });
    } else if (mode === 'value') {
      this._values = values.addInstance('sensor', instanceId);
    }
  }

  /**
   * Triggers this sensor
   */
  trigger() {
    if (!this._trigger) return;
    this._trigger.trigger();
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
}

export = SensorImpl;
