# Zones

Zones represent a geographic grouping of resources such as lights and locks.

Zones are configured in the configuration file:

```json
{
    "zones": [
        {"id":"lounge", "name":"Lounge Room", "parent":"living", "temperature":"sensor.lounge-temperature"},
        {"id":"kitchen", "name":"Kitchen", "parent":"living"},
        {"id":"bedroom", "name":"Bedroom"},
        {"id":"living", "name":"Living Area"}
    ]
}
```

## Fields

### id

*Required*

Unique ID or key for this zone.

### name

*Required*

Display name for the zone.

### parent

A zone heirarchy will be set up if parents are defined.

Presence in parent zones is controlled by the child zones (presence in 1 or more child zones = presence in parent zone).

## temperature

Reference to a value that represents the temperature for this zone.

In the format `value_key:field`, eg: `sensor.hallway:temperature`.

## humidity

Reference to a value that represents the humidity for this zone.

In the format `value_key:field`, eg: `sensor.hallway:humidity`.

## luminosity

Reference to a value that represents the luminosity for this zone.

In the format `value_key:field`, eg: `sensor.hallway:luminosity`.


## Zone Instance Members

Instances of lights, locks, etc can be placed in a zone by setting the `zoneId` option.

For example:

```
{
    {class: 'light', id: 'hallway', type: 'hue', options: {zoneId:'hallway', groupId:9, hub:'main'}},
    {class: 'sensor', id: 'hallway', type: 'ninja', options: {zoneId:'hallway', bridge:'main', deviceName:'hallway'}},
}
```


## Presence

Zone presence can be automatically controlled by placing motion or presence sensors in the zone.

If a zone heirarchy is defined, presence is also controlled by child zones.
