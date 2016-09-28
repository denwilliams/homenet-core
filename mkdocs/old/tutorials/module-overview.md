## Core Concepts

Hosts: hosts
- *triggers:* on ping
    + *events:* trigger.host.{id}

Lights: Hue, Milight, Power, [Z-Wave]
- *switches:* set/get
- *commands:* turnOn, turnOff
- *events:* via switches and commands
    - switch.light.{id}
    - command.lock.{id}.{turnOn|turnOff}

Locks: 
- *switches:* set/get
- *commands:* lock, unlock
- *events:* via switches and commands
    - switch.lock.{id}
    - command.lock.{id}.{lock|unlock}

Sensors:
- *values:* temp/humidity/lum
- *triggers:* trigger
- *events:* via triggers & values
    - trigger.sensor.{id}
    - value.sensor.{id}

Remote Powerpoint
- *switches:* set/get
- *commands:* turnOn, turnOff
- *events:* via switches and commands
    - switch.power.{id}
    - command.power.{id}.{lock|unlock}

Remote Control Buttons
- *triggers:* trigger
- *events:* via triggers
    - trigger.remote.{id}

Media Controller
- *switches* ???
- *commands:* play/pause/stop/next, refresh
- *values:* play state, playlists, etc
- *events:* from values & commands
    - TBD

People
- *presence:* linked to triggers
- *events:* from presence

Zones
- *presence:* linked to triggers
- *events:* from presence


### components

Component modules don't really provide a lot of value by themselves, but are the core building blocks that provide functionality to the higher level modules. These include `commands`, `switches` `trigger`, `values` and `events`.
typically contains or manages multiple instances, for example there are multiple instances of commands and switches.

### categories

Each instance can be in one or more categories, although typically they will only be in one. Managers of `commands`, `switches`, etc can then get or manage instances within a category.

Examples of categories include `lights` and `locks`.

### classes

A class is a usability wrapper around multiple multiple modules of a specific category. Each class instance contains multiple module instances that share the same ID, for example a `lights` class may contain `commands` `switches` and `values` of the same ID.

### zones

Zones are groups of class instances. Class instances in a zone may be of varying category/type. Zones can also contain other zones.

### presence

Presence monitors presence-away state and can either be linked to events with a timeout, or manually set and cleared.



## Components

### events / event-bus

Events may be emitted by any of the above.

### commands

Commands run an action against the intended target, eg playing and pausing. A `type` may define a number of standard command interfaces that can or must be implemented in a plugin, however each plugin can also implement any number of custom commands.

Invalid names for commands include `set` and `get` which are reserved for switches.

```js

```

### switches

Switches are similar to commands in that they can change the state of its target, except that they also can read the current state of the target. 
For example a light switch may be able to be turned on physically as well
as via automation.

A class or plugin may expose the same functionality via both commands and switches.

Switches follow a common interface pattern that allows them to be abstracted nicely in the UI.

Switches turn something on/off (2-state) or change the state of something (multi-state). Some examples of this include power outlets, lights, air conditioners, TVs.

2-state switches are controlled with `set(true)` and `set(false)`. Multi-state values are controlled using `set(state)`.

### triggers

Triggers are one off events that have no state - they are triggered when 

### values

Values are associated with state. When a value changes an associated event will also be sent with the value. The 









### Utilities

#### logger


#### notifications

#### alerts



## Other Modules and Classes

### hosts

Extends presence. Triggers items on-off based on failed/succeeded ping commands.

### people

Extends presence. Can either be manually toggled, or based on one or more child presence items.

### locks

Extends switches and events.

### lights

### power

Power encapsulates `switches`, `triggers` and `values`.





## Usability Modules

Usability modules encapsulate a number of high level modules

### Entertainment

