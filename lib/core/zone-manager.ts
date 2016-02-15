/// <reference path="../../interfaces/interfaces.d.ts" />
/// <reference path="../../typings/lodash/lodash.d.ts" />

import * as _ from 'lodash';
import Zone = require('./models/zone');

class ZoneManagerImpl implements IZoneManager {
  private _zoneHeirarchy : any;
  private _zonesArr : Zone[];

  constructor(presence: IPresenceManager, config: IConfig, logger: ILogger) {
    this._zonesArr = (config.zones || []).map(function(zoneConf) {
      return new Zone(presence, zoneConf);
    });
    this._zoneHeirarchy = this._buildHeirarchy(this._zonesArr);
    //zones.api = buildApi(zones);
  }

  _buildHeirarchy(zones: Array<Zone>) : Dict<Zone> {
    var zoneMap = _.indexBy<string, Zone>(zones, 'id');
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

  getMap() : Dict<IZone> {
    return this._zoneHeirarchy;
  }

  getAll() : IZone[] {
    return this._zonesArr;
  }

  get(id: string) : IZone {
    return this._zoneHeirarchy[id];
  }

}

export = ZoneManagerImpl;
