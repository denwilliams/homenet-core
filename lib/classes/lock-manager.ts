/// <reference path="../../interfaces/interfaces.d.ts" />

class LockManagerImpl {

    /**
     * All lock IDs registered
     * @member {Array<string>} LockManager#ids
     */
    ids: string[] = [];

    /**
     * All locks
     * @member {Array<Lock>} LockManager#all
     */
    all: ILock[] = [];


    locks: Dict<ILock> = {};

    constructor() {
    }

    /**
     * Adds a new lock type
     * @method LockManager#addType
     * @param {string} typeId - unique identifier for this type
     * @param {Locker} type - lock implementation
     */
    addType(typeId, type) {
      this.locks[typeId] = type;
    }

    /**
     * @method LockManager#setLock
     * @param {string} typeId       - unique ID for this type
     * @param {string} [controllerId] - ID of the specific controller for this type (if any)
     * @param {string} lockId       - ID of this lock
     * @param {string} state        - state to set this lock: lock or unlock
     */
    setLock(typeId: string, controllerId: string, lockId: string, value: boolean) {
      this.locks[typeId].setLock(controllerId, lockId, value);
    }

    /**
     * @method LockManager#get
     * @param {string} typeId - lock controller type id
     */
    get(typeId: string): ILock {
      return this.locks[typeId];
    }

    _bindLocks(config: IConfig) {
      var self = this;
      var setLock: SetLockFn = this.setLock.bind(this);
      config.locks.forEach(function (l: ILockConfig) {
        var id: string = l.id;
        var set: SetLockFn = this.setLock.bind(this, l.type, l.controller, l.lockId);

        /**
         * Represents a single lock managed by the {@link LockManager}
         * @class Lock
         */
        var lockObj : ILock = new LockImpl(id, l.type, setLock);

        self[id] = set;
        self.ids.push(id);
        self.all.push(lockObj);
        self.locks[id] = lockObj;
      });
  };


}


interface SetLockFn {
  (type: string, controllerId: string, lockId: string, value: boolean): void
}


class LockImpl implements ILock {

  /**
   * The unique ID of this lock
   * @member {string} Lock#id
   */
  id: string;

  /**
   * The type of lock
   * @member {LockState} Lock#state
   */
  state: LockState;

  /**
   * Sets a new state for a lock
   * @method Lock#set
   * @param {string} state - the state to set to: lock or unlock
   */
  _set: SetLockFn;

  /**
   * The type of lock
   * @member {string} Lock#type
   */
  type: string;

  constructor(id: string, type: string, set: SetLockFn) {
    this.id = id;
    this.type = type;
    this._set = set;

    this.state = LockState.unknown;
  }

  setLock(controllerId: string, lockId: string, value: boolean) : void {
    return this._set(this.type, controllerId, lockId, value);
  }

  getType() : string {
    return this.type;
  }
}

export = LockManagerImpl;
