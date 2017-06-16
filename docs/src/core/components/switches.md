# Switches

Switches represent settable or switchable items such as [class instances](classes.md).
Some classes may provide multiple switches.

Switches can be `set` or `get`, where `set` changes the state (switches) the instance, and `get` returns the current state of the switch.

For example setting a light changes it's state (turn on or off, or change colour), setting a lock will lock or unlock the device.

Most switches can be set with `true` or `false` to toggle the primary values (on/off, enable/disable).

Some switches are overloaded and can accept booleans, numbers and strings. For example Hue lights may accept `true` to turn a light on or `"red"` to set the light color.
