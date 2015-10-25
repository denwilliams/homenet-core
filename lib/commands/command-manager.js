var _ = require('lodash');

/**
 * @constructor
 * @example
 * commandManager.addType('music:plex', plexSpec);
 * commandManager.addInstance('loungeroom:music', 'music:plex');
 * commandManager.run('loungeroom:music', 'pause')
 * commandManager.run('loungeroom:music', 'play', {playlist:'1234'});
 */
function CommandManager(eventBus, logger) {
  this.types = {};
  this.typeMeta = {};
  this.instanceTypes = {};
  this.instances = {};
  this._logger = logger;
  this._eventBus = eventBus;
}

/**
 * Adds a type and the associated commands.
 * @param {string} typeId - identifier for the type
 * @param {function} factory - factory for this type
 */
CommandManager.prototype.addType = function(typeId, factory, meta) {
  this._logger.info('Adding command type ' + typeId);
  this.types[typeId] = factory;
  this.typeMeta[typeId] = meta || {};
};

/**
 * Adds a new instance to the manager
 * @param {string} instanceId - unique ID for this instance
 * @param {string} typeId - type ID for this instance
 * @param {Object} opts - options
 */
CommandManager.prototype.addInstance = function(typeId, instanceId, opts) {
  var id = getId(typeId, instanceId);
  this._logger.debug('Adding command instance ' + instanceId + ' of type ' + typeId + '   ' + id);
  this.instances[id] = this._createSingletonInstance(typeId, opts);
  this.instanceTypes[id] = typeId;
};

CommandManager.prototype.getInstance = function(typeId, instanceId) {
  var id = getId(typeId, instanceId);
  this._logger.debug('Getting command instance ' + id);
  return this.instances[id]();
};

CommandManager.prototype.getAll = function() {
  return _.mapValues(this.instances, function(f) { return f(); });
};

/**
 * Runs a command on an instance
 * @param  {string} instanceId - the ID of the instance to run a command on
 * @param  {string} command  - the command to run
 * @param  {Object} [args] - optional args to be passed to the command
 * @return {*} optionally a value may be returned
 */
CommandManager.prototype.run = function(typeId, instanceId, command, args) {
  var id = getId(typeId, instanceId);
  this._logger.debug('Running command on instance ' + instanceId + ' - cmd:' + command);
  var instance = this.instances[id]();
  if (!instance) return;
  var cmdFn = instance[command];
  if (!cmdFn) return;

  var result = cmdFn.call(instance, args);
  this._eventBus.emit('command.'+id, command, args);
  return result;
};

CommandManager.prototype.getMeta = function(typeId, instanceId) {
  var id = getId(typeId, instanceId);
  this._logger.debug('Getting meta for ' + id);
  var tid = this.instanceTypes[id];
  this._logger.debug('Type is ' + tid);
  console.log(this.typeMeta);
  return this.typeMeta[tid];
};

CommandManager.prototype.getTypeMeta = function(typeId) {
  return this.typeMeta[typeId];
};

CommandManager.prototype._getType = function(typeId) {
  return this.types[typeId];
};

CommandManager.prototype._createSingletonInstance = function(typeId, opts) {
  var factory = this._getType(typeId);
  return singleton(factory, opts);
};

function singleton(factory, opts) {
  var instance;
  return function() {
    if (!instance) instance = factory(opts);
    return instance;
  };
}

function getId(typeId, instanceId) {
  if (instanceId) return typeId+'.'+instanceId;
  return typeId;
}

module.exports = exports = CommandManager;
