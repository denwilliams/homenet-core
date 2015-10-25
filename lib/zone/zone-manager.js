var _ = require('lodash');

function ZoneManager(presence, config) {

  var Zone = require('./zone')(presence);

  this._zonesArr = (config.zones || []).map(function(zoneConf) {
    return new Zone(zoneConf);
  });
  this._zoneHeirarchy = buildHeirarchy(this._zonesArr);
  //zones.api = buildApi(zones);

  function buildHeirarchy(zones) {
    var zoneMap = _.indexBy(zones, 'id');
    zones.forEach(function(zone) {

      if (zone.parentId) {
        // set the actual parent
        zone.parent = zoneMap[zone.parentId];
        // add this as a child
        zoneMap[zone.parentId].children.push(zone);
      }

      //zones[zone.id] = zone;
      // zones.all.push(zoneObj);
      // zones[zone.id] = {
      //   name: zone.name,
      //   //lights: lights.hasLights(zone.id) ? lights.setLights.bind(lights, zone.id) : null,
      //   //locks: locks[zone],
      //   //presence: presence[zone]
      // };
    });
    return zoneMap;
  }

  // function buildApi(zones) {
  //   var app = express();
  //   app.get('/', function(req,res) {
  //     res.send(zones.map(function() {}));
  //   });
  //   app.get('/:id', function(req,res) {
  //     var id = req.params.id;
  //     res.send(zones[id]);
  //   });
  // }
}

ZoneManager.prototype.getMap = function() {
  return this._zoneHeirarchy;
};

ZoneManager.prototype.getAll = function() {
  return this._zonesArr;
};

ZoneManager.prototype.get = function(id) {
  return this._zoneHeirarchy[id];
};

module.exports = exports = ZoneManager;
