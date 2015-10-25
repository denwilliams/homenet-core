module.exports = exports = {
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
    {id:'living', name:'Living Area'}
  ],
  disabled: [
  ],
  instances: [
    {class: 'sensor',   id: 'livingroom',   type: 'virtual',   options: {}},
    {class: 'sensor',   id: 'hallway',      type: 'ninja',     options: {bridge:'main', deviceName:'hallway'}},
    {class: 'light',    id: 'livingroom',   type: 'virtual',   options: {id:5, hub:'main'}},
    {class: 'light',    id: 'lounge',       type: 'hue',       options: {id:8, hub:'main'}},
    {class: 'power',    id: 'livingroom',   type: 'virtual',   options: {id:5, hub:'main'}},
    {class: 'lock',     id: 'livingroom',   type: 'virtual',   options: {id:3, controller:'main'}},
    {class: 'lock',     id: 'lounge',       type: 'zway',      options: {id:3, controller:'main'}}
  ],
  logPath: __dirname,
  logging: {
    papertrail: {
      host: 'localhost',
      port: 3344
    }
  },
  hue: {
    hubs: [
      { id:'main', name:'Main', host:'hue-main', key:'6ebef891575fc774819ecdcdbb39b' }
    ]
  },
  ninjaBlocks: {
    bridges: [
      { id:'main', name:'Main', host:'ninjablock-main' }
    ]
  }
};