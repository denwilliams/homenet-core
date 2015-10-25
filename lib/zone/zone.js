module.exports = exports = function(presence) {
  function Zone(zoneConf) {
    var c = zoneConf;

    this.id = c.id;
    this.name = c.name;
    this.faIcon = c.faIcon;
    this.parent = null;
    this.children = [];
    this.parentId = c.parent;
    
    var parentZone = c.parent ? 'zone.'+c.parent : null;

    var thisPresence = presence.add('zone.'+c.id, {
      category:'zone',
      name: c.name,
      timeout: c.timeout || -1,
      parent: parentZone
    });

    Object.defineProperty(this, 'presence', {get: function() { return thisPresence.isPresent; }});

  }

  return Zone;
};
