// import { Homenet } from '../../interfaces.d.ts';

/**
 * @module i
 */

class Zone implements Homenet.IZone {
  private _presence: Homenet.IPresence;

  id: string;
  name: string;
  faIcon: string;
  parentId: string;
  parent: Zone;
  children: Zone[];

  get presence() {
    return this._presence.isPresent;
  }

  constructor(presence: Homenet.IPresenceManager, zoneConf: Homenet.IZoneConfig) {
    var c = zoneConf;

    this.id = c.id;
    this.name = c.name;
    this.faIcon = c.faIcon;
    this.parent = null;
    this.children = [];
    this.parentId = c.parent;

    var parentZone = c.parent ? 'zone.'+c.parent : null;

    this._presence = presence.add('zone.'+c.id, {
      category:'zone',
      name: c.name,
      timeout: c.timeout || -1,
      parent: parentZone
    });
  }
}

export = Zone;
