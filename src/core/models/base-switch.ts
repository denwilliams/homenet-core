const EVENT_TYPE: string = 'switch';
const EVENT_PREFIX: string = EVENT_TYPE+'.';
import {EventEmitter} from 'events';

abstract class BaseSwitch<T> extends EventEmitter implements Homenet.ISwitch {

  private _id: string;
  private _value: T;

  constructor(id: string, emitOnSet: boolean) {
    super();
    this._id = id;
  }

  get() : T {
    return this._value;
  }

  set(value: T) : void {
    this._value = value;
    this.emit('updated', value);
  }
}

export = BaseSwitch;
