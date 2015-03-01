var util = require("util");
var events = require("events");

module.exports = exports = Presence;

function Presence(opts) {
  var id = opts.id,
    timeout = opts.timeout,
    logger = opts.logger,
    persistence = opts.persistence;

  var self = this;

  logger.debug('Starting presence monitor with timeout ' + timeout);

  events.EventEmitter.call(this);

  this.id = this._id = id;
  this.name = opts.name;
  this.category = opts.category;
  this.disabled = !!(opts.disabled);

  this._logger = logger;
  this._persistence = persistence;
  this._timeout = timeout || 60000;
  this._timer = null;
  this._isPresent = false;
  this._activeChildren = 0;
  
  this._unpresent = function() {
    self._isPresent = false;
    self._timer = null;
    self.emit('present', false);
  };
  this._present = function() {
    console.log('making present');
    self._isPresent = true;
    self.emit('present', true);
  };

  Object.defineProperty(this, 'isPresent', {
    get: function() {
      return self._isPresent;
    }
  });

  init();

  function init()  {
    if (persistence) {
      var initial = persistence.get(id);
      logger.info('Using persistence for ' + id, initial);
      if (initial) self.set();
      else self.clear();
    }
  }

}

util.inherits(Presence, events.EventEmitter);

Presence.prototype.present = function() {
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
};

Presence.prototype.childActivated = function() {
  this._activeChildren++;
  if (!this._isPresent) {
    this.set();
  }
};

Presence.prototype.childDeactivated = function() {
  this._activeChildren--;

  if (this._activeChildren < 0) this._activeChildren = 0;

  if (this._activeChildren === 0 && this._isPresent) {
    this.clear();
  }
};

Presence.prototype.set = function() {
  if (this._timer) {
    clearTimeout(this._timer);
    this._timer = null;
  }
  if (!this._isPresent) {
    this._present();
  }
  if (this._persistence) {
    this._persistence.set(this._id, true);
  }
};

Presence.prototype.clear = function() {
  if (this._timer) {
    clearTimeout(this._timer);
    this._timer = null;
  }
  if (this._isPresent) {
    this._unpresent();
  }
  if (this._persistence) {
    this._persistence.set(this._id, false);
  }
};

Presence.prototype.toggle = function() {
  if (this._isPresent) this.clear();
  else this.set();
};
