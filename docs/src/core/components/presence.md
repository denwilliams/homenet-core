# Presence

Presence items represent the presence of something, for example a presence for a motion sensor indicates the detection of an object,
presnece of a person indicates their presence at the home,
presence of a zone indicates the occupancy of a zone.

Every presence item exhibits a presence state - `present` or `away`.

The presence of a specific item can be regulated in three ways:

1. By `set`ing or `clear`ing the item's presence. This is typical for a person or zone, or intelligent motion sensors.
2. By `bump`ing the presence with a `timeout` interval. This is typical for simple motion sensors that operate on more of a fire-and-forget approach.
3. By having children, in which case the presence is regulated by the presence of any of the child items. This is typical of zones that are regulated by sensors, or