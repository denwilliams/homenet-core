var EventEmitter = require('events').EventEmitter;
import _ = require('lodash');
import TriggerImpl = require('./models/trigger');
import {inject, injectable} from 'inversify';

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
export class TriggerManager implements ITriggerManager {

  private _logger : ILogger;
  private _eventBus : IEventBus;

  public instances : Dict<ITrigger>;

  constructor(
      @inject('IEventBus') eventBus: IEventBus,
      @inject('ILogger') logger: ILogger) {
    this._logger = logger;
    this._eventBus = eventBus;
    this.instances = {};
  }

  /**
   * Adds a trigger.
   */
  add(typeId: string, instanceId: string, emitter: IEventEmitter) {
    var eventBus = this._eventBus;
    var id = typeId+'.'+instanceId;
    var instance = this.instances[id] = new TriggerImpl(id, emitter || new EventEmitter());
    instance.onTrigger(function(data) {
      eventBus.emit('trigger.'+id, null, data);
    });
    return instance;
  };

  getAll() : ITrigger[] {
    return _.values<ITrigger>(this.instances);
  };

  get(typeId: string, instanceId: string) : ITrigger {
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
