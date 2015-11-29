var MilightController = require('node-milight-promise').MilightController;
var commands = require('node-milight-promise').commands;

function createMilightFactory(config, lights, logger) {

  var bridges = {};

  if (config.milight && config.milight.bridges) {
    config.milight.bridges.forEach(function(bridge) {
      var id = bridge.id;
      var name = bridge.name;
      var host = bridge.host;
      logger.info('Setting up bridge ' + name + ' (' + id + ') on ' + host);
      var opts = {
        ip: host,
        delayBetweenCommands: 35,
        commandRepeat: 3
      };
      bridges[id] = new MilightController(opts);
    });
  }

  function logError(err) {
    logger.error(err.toString());
  }

  function sendCommands(bridge, zone, command) {
    bridge.sendCommands(command(zone));
  }

  function Milight(id, opts) {
    this.bridge = opts.bridge;
    this.id = opts.zoneId;
    this.state = 'unknown';
    
    var api = bridges[this.bridge];
    this._sendCommands = sendCommands.bind(null, api, this.id);
  }
  Milight.prototype.set = function(value) {
    this.state  = value;
    logger.info('SET MILIGHT STATE TO ' + value);
    this._sendCommands(getLightStateForValue(value));
  };
  Milight.prototype.get = function() {
    return this.state;
  };
  Milight.prototype.emitOnSet = true;

  function milightFactory(id, opts) {
    logger.info('Adding Milight: ' + id);
    return new Milight(id, opts);
  }

  return milightFactory;
}

function getLightStateForValue(value) {
  if (value === true || value === 'on') return commands.white.on.bind(commands.white);
  // if (value === false) {}
  return commands.white.off.bind(commands.white);
}

module.exports = exports = createMilightFactory;
