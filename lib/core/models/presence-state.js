var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var events_1 = require('events');
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
var PresenceState = (function (_super) {
    __extends(PresenceState, _super);
    function PresenceState(opts) {
        _super.call(this);
        this._timer = null;
        this._isPresent = false;
        this._activeChildren = 0;
        var id = opts.id, timeout = opts.timeout, logger = opts.logger, persistence = opts.persistence;
        logger.debug('Starting presence monitor with timeout ' + timeout);
        this.disabled = !!(opts.disabled);
        this.category = opts.category;
        this.name = opts.name;
        this.id = id;
        this._logger = logger;
        this._timeout = timeout || 60000;
        this._persistence = persistence;
        this._timer = null;
    }
    PresenceState.prototype._unpresent = function () {
        this._logger.info('Making un-present - ' + this.id);
        this._isPresent = false;
        this._timer = null;
        this.emit('present', false);
    };
    PresenceState.prototype._present = function () {
        this._logger.info('Making present - ' + this.id);
        this._isPresent = true;
        this.emit('present', true);
    };
    Object.defineProperty(PresenceState.prototype, "isPresent", {
        /**
         * Gets a value indicating whether this item is currently present
         * @member {boolean} module:presence.PresenceState#isPresent
         */
        get: function () {
            return this._isPresent;
        },
        enumerable: true,
        configurable: true
    });
    PresenceState.prototype.init = function () {
        if (this._persistence) {
            var initial = this._persistence.get(this.id);
            this._logger.info('Using persistence for ' + this.id + ' (initial: ' + initial + ')');
            if (initial)
                this.set();
            else
                this.clear();
        }
    };
    /**
     * Bumps the presence of this item.
     * Note for this to work the item must have a timeout defined.
     */
    PresenceState.prototype.present = function () {
        this.bump();
    };
    PresenceState.prototype.bump = function () {
        if (this._timer) {
            //this._logger.debug('resetting timeout');
            clearTimeout(this._timer);
        }
        this._timer = setTimeout(this._unpresent, this._timeout);
        if (!this._isPresent) {
            this._present();
        }
        else {
        }
    };
    /**
     * Indicates that at child items presence state has been activated.
     * After calling this method the item will always be present.
     * If this item is already present then there will be no state change.
     * The item will remain present until all children are no longer present,
     * indicated by calling {@link module:presence.PresenceState#childDeactivated|childDeactivated}.
     */
    PresenceState.prototype.childActivated = function () {
        this._activeChildren++;
        if (!this._isPresent) {
            this.set();
        }
    };
    /**
     * Indicates that a child items present state has been deactivated.
     * After all children are no longer present this item will also become
     * not present.
     * Activate children using {@link module:presence.PresenceState#childActivated|childActivated}
     */
    PresenceState.prototype.childDeactivated = function () {
        this._activeChildren--;
        if (this._activeChildren < 0)
            this._activeChildren = 0;
        if (this._activeChildren === 0 && this._isPresent) {
            this.clear();
        }
    };
    ;
    /**
     * Sets this items presence state to true / present.
     */
    PresenceState.prototype.set = function () {
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
    };
    PresenceState.prototype.add = function (id, opts) {
        // ???
    };
    /**
     * Clears this item's presence state (ie sets this item as not present)
     */
    PresenceState.prototype.clear = function () {
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
    };
    /**
     * Toggles the item as present or not
     */
    PresenceState.prototype.toggle = function () {
        if (this._isPresent)
            this.clear();
        else
            this.set();
    };
    return PresenceState;
})(events_1.EventEmitter);
module.exports = PresenceState;
