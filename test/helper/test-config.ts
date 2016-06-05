/// <reference path="../../interfaces/interfaces.d.ts"/>

const testConfig : any = {
  webServerPort: 3210,
  dataPath: __dirname + '/data',
  nodeRed: {
    route: '/rules',
    apiRoute: '/red'
  },
  scenes: [
    {id:'day', name:'Day'},
    {id:'night', name:'Night'},
    {id:'away', name:'Away'},
    {id:'sleep', name:'Sleep'}
  ],
  zones: [
    {id:'lounge', name:'Lounge Room', parent:'living'},
    {id:'kitchen', name:'Kitchen', parent:'living'},
    {id:'bedroom', name:'Bedroom'},
    {id:'hallway', name:'Hallway'},
    {id:'living', name:'Living Area'}
  ],
  location: {
    latitude: -37.8136111,
    longitude: 144.9630556
  },
  instances: [
    {class: 'sensor',   id: 'livingroom-value',   type: 'virtual',   options: {mode: 'value'}},
    {class: 'sensor',   id: 'livingroom-toggle',  type: 'virtual',   options: {mode: 'toggle', zone: 'lounge'}},
    {class: 'sensor',   id: 'livingroom-trigger', type: 'virtual',   options: {mode: 'trigger', timeout: 20000, zone: 'lounge'}},
    {class: 'power',    id: 'livingroom',   type: 'virtual',   options: {id:5, hub:'main'}},
    {class: 'lock',     id: 'livingroom',   type: 'virtual',   options: {id:3, controller:'main'}},
    {class: 'light',    id: 'livingroom',   type: 'virtual',   options: {id:5, hub:'main'}},
    {class: 'light',    id: 'lounge',       type: 'virtual',   options: {id:5, hub:'main'}},
    {class: 'light',    id: 'kitchen',      type: 'virtual',   options: {id:5, hub:'main'}},
    {class: 'light',    id: 'bbq',          type: 'virtual',   options: {id:5, hub:'main'}},
    {class: 'light',    id: 'deck',         type: 'virtual',   options: {id:5, hub:'main'}},
  ],
  instancesReal: [
    {class: 'sensor',   id: 'hallway',      type: 'ninja',     options: {bridge:'main', deviceName:'hallway', zone:'hallway'}},
    {class: 'lock',     id: 'backdoor',     type: 'zway',      options: {id:5, controller:'main'}},
    {class: 'person',   id: 'dennis',       type: 'person',    options: {name:'Dennis', timeout:10000, token:'SNJNSJJNSKLS'}},
    {class: 'person',   id: 'kylie',        type: 'person',    options: {name:'Kylie', timeout:10000}},
    {class: 'light',    id: 'deck',         type: 'milight',   options: {zoneId:1, bridge:'deck'}},
    {class: 'light',    id: 'bbq',          type: 'milight',   options: {zoneId:3, bridge:'deck'}},
    {class: 'light',    id: 'lounge',       type: 'hue',       options: {groupId:6, hub:'main'}},
    {class: 'light',    id: 'kitchen',      type: 'hue',       options: {groupId:4, hub:'main'}},
    {class: 'light',    id: 'hallway',      type: 'hue',       options: {groupId:3, hub:'main'}},
    {class: 'light',    id: 'bedroom',      type: 'hue',       options: {groupId:2, hub:'main'}},
    {class: 'light',    id: 'study',        type: 'hue',       options: {groupId:5, hub:'main'}},
  ],
  logPath: __dirname + '/logs/',
  logging: {
    papertrail: {
      host: 'localhost',
      port: 3344
    }
  },
  zway: {
    controllers: [
      { id:'main', name:'Main', host:'zway-main' }
    ]
  },
  hue: {
    hubs: [
      { id:'main', name:'Main', host:'hue-main', key:'6ebef891575fc774819ecdcdbb39b' }
    ]
  },
  milight: {
    bridges: [
      { id:'deck', name:'Deck', host:'192.168.0.27' }
    ]
  },
  ninjaBlocks: {
    bridges: [
      { id:'main', name:'Main', host:'ninjablock-main' }
    ]
  }
};

const config : IConfig = testConfig;
export = config;
