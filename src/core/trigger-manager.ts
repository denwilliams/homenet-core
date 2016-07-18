import _ = require('lodash');
import { EventEmitter } from 'events';
import { Trigger } from './models/trigger';
import { inject, injectable } from 'inversify';

/**
 * @constructor
 * @example
 * var myTrigger = triggerManager.add('sensors', 'loungeroom');
 *
 * myTrigger.on('trigger', handler);
 * myTrigger.trigger();
 *
 * triggerManager.onTrigger('sensors', 'loungeroom', handler);
 * triggerManager.trigger('sensors', 'loungeroom');
 */
@injectable()
export class TriggerManager implements Homenet.ITriggerManager {

  private _logger : Homenet.ILogger;
  private _eventBus : Homenet.IEventBus;
  private _statsManager : Homenet.IStatsManager;

  public instances : Homenet.Dict<Homenet.ITrigger>;

  constructor(
      @inject('IEventBus') eventBus: Homenet.IEventBus,
      @inject('IStatsManager') statsManager: Homenet.IStatsManager,
      @inject('ILogger') logger: Homenet.ILogger) {
    this._logger = logger;
    this._eventBus = eventBus;
    this._statsManager = statsManager;
    this.instances = {};
  }

  /**
   * Adds a trigger.
   */
  add(typeId: string, instanceId: string, emitter: Homenet.IEventEmitter) {
    const id = typeId + '.' + instanceId;
    const uid = 'trigger.' + id;
    const instance = this.instances[id] = new Trigger(id, emitter || new EventEmitter());
    instance.onTrigger(data => {
      this._eventBus.emit(uid, 'triggered', data);
      this._statsManager.counter(uid, data);
    });
    return instance;
  };

  getAll() : Homenet.ITrigger[] {
    return _.values<Homenet.ITrigger>(this.instances);
  };

  get(typeId: string, instanceId: string) : Homenet.ITrigger {
    var id = getId(typeId, instanceId);
    return this.instances[id];
  };

  trigger(typeId: string, instanceId: string, data: any) : void {
    this.get(typeId, instanceId).trigger(data);
  };

  /**
   * Listens for a trigger
   */
  onTrigger(typeId: string, instanceId: string, listener: Function) : void {
    var id = typeId+'.'+instanceId;
    this.instances[id].onTrigger(listener);
  };
}

function getId(typeId, instanceId) {
  if (instanceId) return typeId+'.'+instanceId;
  return typeId;
}
