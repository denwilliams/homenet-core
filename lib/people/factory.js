var Person = require('./person');

module.exports = exports = function(personManager, logger) {
  function personFactory(instanceId, typeId, opts) {
    var name = opts.name || instanceId;
    return personManager.add(instanceId, name, opts.timeout);
  }

  return personFactory;
};
