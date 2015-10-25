exports.locks = function createZwayLocksFactory(locks, logger) {
  function ZwayLock(id, opts) {
    this.controller = opts.controller;
    this.id = opts.id;
    this.state = 'unknown';
  }
  ZwayLock.prototype.set = function(value, done) {
    this.state  = value;
    logger.info('SET ZWAY LOCK STATE TO ' + value);
    this._setZwayLock(getLightStateForValue(value));
    if (done) done();
  };
  ZwayLock.prototype.get = function() {
    return this.state;
  };
  function zwayLockFactory(id, opts) {
    logger.info('Adding Zway lock: ' + id);
    return new ZwayLock(id, opts);
  }
  return zwayLockFactory;
};
