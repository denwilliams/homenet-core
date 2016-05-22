# Homenet Core

## How to Use

...

```js
import {Core} from 'homenet-core';
const core = new Core();
core.start();
```

With plugins:
```ts
import {Core} from 'homenet-core';
const core = new Core();
core.addPlugin(pluginLoader);
core.start();
```


## Available Services

### [Scene Manager](interfaces/iscenemanager.html)

Provides information on the available scenes, allows controlling and retrieving the currently active scene.

Scenes should be defined in the configuration.

**Properties:**
- `current:Object` - Gets the current scene details
- `currentId:String` - Gets the string name (ID) of the current scene
- scenes:Array[Object] - Gets all of the available scenes

**Methods:**
- set(id:String) - Set (change) the active scene by specifying the new ID
- on(event:String, cb:Function) - Specify an event handler for the specified event (see below for events)
- onChanged(cb:Function) - Specify an event handler for the 'changed' event

**Events:**
- changed:Scene - fired when a scene changes

### presence

Monitors for the presence of a device, person, zone or device.

Monitored items should be defined in the configuration.

**Methods:**
- on(event:String, cb:Function) - Specify an event handler for the specified event (see below for events)

**Events:**
- presence:Presence - Fired when the presence of a particular item is changed
- {id}:Boolean - Fired when the presence of an item is changed, where {id} is the .id of the item being monitored

*Note: both events will be fired. Use presence to listen for all events, or the ID to listen for the presence of a particular item.*

### zone

Provides information and access to the available zones.

Zones should be defined in the configuration.

**Properties:**
- zones:Array[Zone] - Returns all available zones

**Methods:**
- getZone(id:String) - Gets a specific zone specified by the ID

### storage

**Methods:**

Both methods return a Q promise that resolve when the task is complete.

- get(key:String):Promise[Object]
- set(key:String,value:Object):Promise

### logger

**Methods:**
- getLogger(context:String):Logger - Gets a logger for the specified context






## Models

### Scene
tbd

### Presence
```js
{
    id: String,
    present: Boolean,
    category: String // person|device|zone|media
}
```

### Logger

**Methods:**
- log
- info
- warn
- error
- debug


## See Also

[Globals](globals.html)
