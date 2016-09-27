# Classes

Classes represent common interactable objects in domotics.

## Standard Classes

Core defines a number of standard classes by default.
These cannot be removed:
- People
- Lights
- Locks
- Sensors

## Class Types

Lights, locks and sensors are all *typed* classes, which essentially mean that the class is abstract and requires implementations for each type.
Typically this corresponds to specific brands or products, for example Hue or LIFX for `Lights`.

## Adding Custom Classes

- Use `ClassesManager` to add class
- Extend `ClassTypeManager` to easily add typed classes
- Use instances in `IConfig` to add instances

