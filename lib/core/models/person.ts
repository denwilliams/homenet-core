/// <reference path="../../../interfaces/interfaces.d.ts"/>

/**
 * Person
 * @class
 */
class Person {

  public id : string;
  public name : string;
  private _presence: IPresence;

  constructor(id:string, name:string, presence:IPresence) {
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
  }

  /**
   * @implements Switch#get
   */
  get() : boolean {
    return this._presence.isPresent;
  }

}

export = Person;
