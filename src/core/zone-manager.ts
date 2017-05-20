// import {keyBy} from 'lodash';
const _ = require('lodash');
const keyBy = _.keyBy;

import Zone = require('./models/zone');
import {inject, injectable} from 'inversify';

@injectable()
export class ZoneManager implements Homenet.IZoneManager {
  private _zoneHeirarchy : any;
  private _zonesArr : Zone[];

  constructor(
        @inject('IPresenceManager') presence: Homenet.IPresenceManager,
        @inject('IValuesManager') values: Homenet.IValuesManager,
        @inject('IConfig') config: Homenet.IConfig,
        @inject('ILogger') logger: Homenet.ILogger) {
    this._zonesArr = (config.zones || []).map(function(zoneConf) {
      return new Zone(presence, values, zoneConf);
    });
    this._zoneHeirarchy = this._buildHeirarchy(this._zonesArr);
    //zones.api = buildApi(zones);
  }

  _buildHeirarchy(zones: Array<Zone>) : Homenet.Dict<Zone> {
    // var zoneMap = keyBy<string, Zone>(zones, 'id');
    var zoneMap = keyBy(zones, 'id');
    zones.forEach(function(zone: Zone) {

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

  getMap() : Homenet.Dict<Homenet.IZone> {
    return this._zoneHeirarchy;
  }

  getAll() : Homenet.IZone[] {
    return this._zonesArr;
  }

  get(id: string) : Homenet.IZone {
    return this._zoneHeirarchy[id] || null;
  }
}
