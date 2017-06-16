# Starting Homenet Core

## As a Global Package

The best way to use now is to install globally:

```
npm install -g @homenet/core
```

Then install any plugins:

```
npm install -g @homenet/plugin-hue @homenet/plugin-mqtt
```

Then create a config file somewhere like `/etc/homenet/config.json`.

Then to run:

```
homenet4 /etc/homenet/config.json
```

## As a Module

```js
const homenet = require('homenet-core');
const RED = require('node-red');
const myConfig = require('./config');

homenet.init(RED, config)
.start()
.then(() => {
  console.log('Started');
});
```

```js
const homenet = require('homenet-core');
const RED = require('node-red');
const myConfig = require('./config');
const myPlugin = require('./plugin');

homenet.init(RED, config)
.loadPlugin(myPlugin);
.start()
.then(() => {
  console.log('Started');
});
```
