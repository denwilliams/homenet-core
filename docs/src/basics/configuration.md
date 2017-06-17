# Configuration

To configure, create a `js` or `json` file somewhere.

Pass this in to `homenet4` as the last argument.

If no configuration is passed in it uses `/etc/homenet4/config.json`.

## Example

```json
{
  "dataPath": "",
  "webServerPort": 1234,
  "location": {
    "latitude": 37.8136,
    "longitude": 144.9631
  },
  "zones": [
    {}
  ],
  "scenes": [
    {}
  ],
  "people": [
    {}
  ],
  "instances": [
    {}
  ]
}
```

## Schema

```json
{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "definitions": {},
    "id": "http://homenet4/api/v1",
    "properties": {
        "dataPath": {
            "id": "/properties/dataPath",
            "type": "string"
        },
        "instances": {
            "id": "/properties/instances",
            "items": {},
            "type": "array"
        },
        "location": {
            "id": "/properties/location",
            "properties": {
                "latitude": {
                    "id": "/properties/location/properties/latitude",
                    "type": "number"
                },
                "longitude": {
                    "id": "/properties/location/properties/longitude",
                    "type": "number"
                }
            },
            "type": "object"
        },
        "people": {
            "id": "/properties/people",
            "items": {},
            "type": "array"
        },
        "scenes": {
            "id": "/properties/scenes",
            "items": {},
            "type": "array"
        },
        "webServerPort": {
            "id": "/properties/webServerPort",
            "type": "integer"
        },
        "zones": {
            "id": "/properties/zones",
            "items": {},
            "type": "array"
        }
    },
    "type": "object"
}
```

