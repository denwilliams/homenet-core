import { EventEmitter } from 'events';

/**
 * Person
 * @class
 */
export class Person extends EventEmitter implements Homenet.IPerson {

  public id : string;
  public name : string;
  private _presence: Homenet.IPresence;

  constructor(id:string, name:string, presence:Homenet.IPresence) {
    super();
    this.id = id;
    this.name = name;
    this._presence = presence;
  }

  get presence() {
    return this._presence.isPresent;
  }

  bump() : void {
    this._presence.bump();
  }

  /**
   * @implements Switch#set
   */
  set(isPresent: boolean) : void {
    if (isPresent) this._presence.set();
    else this._presence.clear();
    this.emit('updated', isPresent);
  }

  /**
   * @implements Switch#get
   */
  get() : boolean {
    return this._presence.isPresent;
  }
}
