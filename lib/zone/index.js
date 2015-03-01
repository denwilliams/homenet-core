module.exports = exports = factory;
exports.$implements = 'zone';
exports.$inject = ['logger', 'config', 'presence'];

function factory(services) {
  var presence = services.presence;

  var zones = {
    all: []
  };

  // var lights = services['lights'];
  // var presence = services['presencemonitor'];
  // var locks = services['locks'];
  
  var config = services.config;

  buildHeirarchy();

  return zones;

  function buildHeirarchy() {
    // step1 add zones
    config.zones.forEach(function(zone) {
      var zoneObj = {
        id: zone.id,
        name: zone.name,
        faIcon: zone.faIcon,
        parent: null,
        children: []
      };

      zones[zone.id] = zoneObj;
      zones.all.push(zoneObj);
      var parent = zone.parent ? 'zone:'+zone.parent : null;
      presence.add('zone:'+zone.id, {category:'zone', name:zone.name, timeout:zone.timeout || -1, parent: parent});

      // zones[zone.id] = {
      //   name: zone.name,
      //   //lights: lights.hasLights(zone.id) ? lights.setLights.bind(lights, zone.id) : null,
      //   //locks: locks[zone],
      //   //presence: presence[zone]
      // };
    });

    // step2 resolve parents
    config.zones.forEach(function(zone) {
      if (zone.parent) {
        zones[zone.id].parent = zones[zone.parent];
        zones[zone.parent].children.push(zones[zone.id]);
      }
    });
  }
}
