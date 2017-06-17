// import { Homenet } from '../../interfaces.d.ts';

/**
 * @module i
 */

class Zone implements Homenet.IZone {
  private _presence: Homenet.IPresence;

  id: string;
  name: string;
  parentId: string;
  parent: Zone;
  children: Zone[];

  constructor(presence: Homenet.IPresenceManager, private values: Homenet.IValuesManager, private zoneConf: Homenet.IZoneConfig) {
    var c = zoneConf;

    this.id = c.id;
    this.name = c.name;
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

  get presence() {
    return this._presence.isPresent;
  }

  get temperature() {
    return this.getValue(this.zoneConf.temperature);
  }

  get humidity() {
    return this.getValue(this.zoneConf.humidity);
  }

  get luminescence() {
    return this.getValue(this.zoneConf.luminescence);
  }

  private getValue(path: string) : any {
    if (!path) return null;

    const parts = path.split(':');
    const instance = this.values.getInstance(parts[0]);
    if (!instance) return null;

    return instance.get(parts[1]);
  }
}

export = Zone;
