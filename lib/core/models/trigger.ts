/// <reference path="../../../interfaces/interfaces.d.ts"/>

/**
 * @classdesc Emits events when triggered
 * @constructor
 * @param {EventEmitter} eventEmitter - the event emitter to use to emit events
 */
class TriggerImpl implements ITrigger {

  public lastTriggered: Date;
  public id: string;

  private _eventEmitter: IEventEmitter;

  constructor(id: string, eventEmitter: IEventEmitter) {
    this.id = id;
    this.lastTriggered = null;
    this._eventEmitter = eventEmitter;
  }

  /**
   * @method Trigger#onTrigger
   */
  onTrigger(cb: Function) : void {
    this._eventEmitter.on('trigger', cb);
  }

  _emitTrigger(data?: any) : void {
    this._eventEmitter.emit('trigger', data);
  }

  /**
   * Triggers this instance
   */
  trigger(data?: any) : void {
    this._emitTrigger(data);
    this.lastTriggered = new Date();
  }

}

export = TriggerImpl;
