# Starting Homenet Core

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
