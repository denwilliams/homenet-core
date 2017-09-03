/**
 * @classdesc Emits events when triggered
 * @constructor
 * @param {EventEmitter} eventEmitter - the event emitter to use to emit events
 */
export class Trigger implements Homenet.ITrigger {

  public lastTriggered: Date | null;
  public id: string;

  private _eventEmitter: Homenet.IEventEmitter;

  constructor(id: string, eventEmitter: Homenet.IEventEmitter) {
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

  removeOnTriggerListener(cb: Function) : void {
    this._eventEmitter.removeListener('trigger', cb);
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
