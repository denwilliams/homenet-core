import util = require('util');
import { EventEmitter } from 'events';
// import { Homenet } from '../../interfaces.d.ts';

/**
 * Creates a new presence state manager using the supplied options
 * @param {Object} opts - options
 * @param {string} opts.id - ID of this item
 * @param {integer} [opts.timeout] - timeout period if using method 2
 * @param {string} [opts.name] - display name of the item
 * @param {string} [opts.category] - category name
 * @param {boolean} [opts.disabled] - if true then ???
 * @param {Persistence} [opts.persistence] - if provided this will be used to persist current states, and to load on restart
 *
 * @constructor
 * @classdesc
 * Manages the presence state for an item.
 * It is possible to manage the presence of an item in multiple ways:
 *
 * 1. Manually set or clear the state using
 * {@link module:presence.PresenceState#set|set},
 * {@link module:presence.PresenceState#clear|clear} and
 * {@link module:presence.PresenceState#toggle|toggle}... or
 *
 * 2. *Bumping* the presence state of the item using
 * {@link module:presence.PresenceState#present|present}.
 * This requires a timeout period to be defined in the constructor options.
 *
 * 3. Tying the presence of this item to one or more child items by using
 * {@link module:presence.PresenceState#childActivated|childActivated} and
 * {@link module:presence.PresenceState#childDeactivated|childDeactivated}
 *
 * *Note: only use one of the 3 techniques above per item*
 *
 * @memberOf module:presence
 */
class PresenceState extends EventEmitter implements Homenet.IPresence {

  /**
   * unique identifier
   * @member {string} id
   * @memberOf module:presence.PresenceState#
   */
  public id : string;

  /**
   * descriptive name
   * @member {string} name
   * @memberOf module:presence.PresenceState#
   */
  public name : string;

  /**
   * category id
   * @member {string} category
   * @memberOf module:presence.PresenceState#
   */
  public category : string;

  /**
   * indicates whether this instance is disabled
   * @member {boolean} disabled
   * @memberOf module:presence.PresenceState#
   */
  public disabled : boolean;

  private _logger : Homenet.ILogger;
  private _persistence: any;
  private _timeout : number;

  private _timer : any = null;
  private _isPresent : boolean = false;
  private _activeChildren : number = 0;

  constructor(opts: any) {
    super();

    var id = opts.id,
      timeout = opts.timeout,
      logger = opts.logger,
      persistence = opts.persistence;

    logger.debug('Starting presence monitor with timeout ' + timeout);

    this.disabled = !!(opts.disabled);
    this.category = opts.category;
    this.name = opts.name
    this.id = id;

    this._logger = logger;
    this._timeout = timeout || 60000;
    this._persistence = persistence;
    this._timer = null;
  }

  private _unpresent() : void {
    this._logger.info('Making un-present - ' + this.id);
    this._isPresent = false;
    this._timer = null;
    this.emit('present', false);
  }

  private _present() : void {
    this._logger.info('Making present - ' + this.id);
    this._isPresent = true;
    this.emit('present', true);
  }

  /**
   * Gets a value indicating whether this item is currently present
   * @member {boolean} module:presence.PresenceState#isPresent
   */
  get isPresent() : boolean {
    return this._isPresent;
  }

  init()  {
    if (this._persistence) {
      var initial = this._persistence.get(this.id);
      this._logger.info('Using persistence for ' + this.id + ' (initial: ' + initial + ')');
      if (initial) this.set();
      else this.clear();
    }
  }


  /**
   * Bumps the presence of this item.
   * Note for this to work the item must have a timeout defined.
   */
   present() : void {
     this.bump();
   }

   bump() : void {
    if (this._timer) {
      //this._logger.debug('resetting timeout');
      clearTimeout(this._timer);
    }
    this._timer = setTimeout(this._unpresent, this._timeout);
    if (!this._isPresent) {
      this._present();
    } else {
      //this._logger.debug('extended presence');
    }
  }

  /**
   * Indicates that at child items presence state has been activated.
   * After calling this method the item will always be present.
   * If this item is already present then there will be no state change.
   * The item will remain present until all children are no longer present,
   * indicated by calling {@link module:presence.PresenceState#childDeactivated|childDeactivated}.
   */
  childActivated() : void {
    this._activeChildren++;
    if (!this._isPresent) {
      this.set();
    }
  }

  /**
   * Indicates that a child items present state has been deactivated.
   * After all children are no longer present this item will also become
   * not present.
   * Activate children using {@link module:presence.PresenceState#childActivated|childActivated}
   */
  childDeactivated() : void {
    this._activeChildren--;

    if (this._activeChildren < 0) this._activeChildren = 0;

    if (this._activeChildren === 0 && this._isPresent) {
      this.clear();
    }
  };

  /**
   * Sets this items presence state to true / present.
   */
  set() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
    if (!this._isPresent) {
      this._present();
    }
    if (this._persistence) {
      this._persistence.set(this.id, true);
    }
  }

  add(id: string, opts: Homenet.IPresenceOpts) {
    // ???
  }


  /**
   * Clears this item's presence state (ie sets this item as not present)
   */
  clear() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
    if (this._isPresent) {
      this._unpresent();
    }
    if (this._persistence) {
      this._persistence.set(this.id, false);
    }
  }

  /**
   * Toggles the item as present or not
   */
  toggle() {
    if (this._isPresent) this.clear();
    else this.set();
  }

}

export = PresenceState;
