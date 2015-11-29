/// <reference path="../../interfaces/interfaces.d.ts" />

class Zone {
  
  private _presence: Presence;
  
  id: string;
  name: string;
  faIcon: string;
  parentId: string;
  parent: Zone;
  children: Zone[];
  
  get presence() {
    return this._presence.isPresent;
  }
  
  constructor (presence: Presence, zoneConf: ZoneConfig) {
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
  }
}

export = Zone;
