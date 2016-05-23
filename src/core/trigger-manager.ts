/// <reference path="../interfaces.d.ts"/>

var EventEmitter = require('events').EventEmitter;
import _ = require('lodash');
import TriggerImpl = require('./models/trigger');
import {inject, injectable} from 'inversify';
// import {Homenet} from '../interfaces.d.ts';

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

  public instances : Homenet.Dict<Homenet.ITrigger>;

  constructor(
      @inject('IEventBus') eventBus: Homenet.IEventBus,
      @inject('ILogger') logger: Homenet.ILogger) {
    this._logger = logger;
    this._eventBus = eventBus;
    this.instances = {};
  }

  /**
   * Adds a trigger.
   */
  add(typeId: string, instanceId: string, emitter: Homenet.IEventEmitter) {
    var eventBus = this._eventBus;
    var id = typeId+'.'+instanceId;
    var instance = this.instances[id] = new TriggerImpl(id, emitter || new EventEmitter());
    instance.onTrigger(function(data) {
      eventBus.emit('trigger.'+id, null, data);
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
