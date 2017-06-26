# Homenet Core

Home automation system tightly coupled with [Node RED](https://nodered.org) intended for those who like to write their own code.

I'm not a fan of complex web and app interfaces, so the approach is more of a hands off - triggers are automatic or via sensors or buttons. There is an Android tablet app in the works that uses multi-finger gestures to control things. Ideally I'd like to integrate with voice control when that becomes feasible.

## Powerful Rules

- Uses [Node RED](https://nodered.org) for rule system. Much more powerful than the IFTTT style rules used by others.
- Infinite number of "scenes". Each scene is like a clean slate of rules. When the scene changes, so do the Node RED flows. For example have a "day" and "night" scene, one for when you're "away" from home, one for when you're watching "movies", one for when you're "entertaining".
- Common tabs - any Node RED tab that starts with the word "Common" is available in every scene. No need to repeat rules that you always want available.
- [Custom Node RED nodes](https://www.npmjs.com/package/@homenet/nodes) are provided for tighter integration with core.

## Pluggable Architecture

Core relies on plugins to communicate with external devices and services.

- Core plugins can easily be written in Javascript or Typescript (or any other language that compiles to Javascript such as Coffeescript).
- Core plugins are discovered automatically if installed globally via NPM.
- Any Node RED plugin can also be used within the rule systems (although they will not be controllable via the HTTP API).

## API

External applications can interact and control devices via the HTTP APIs. There is both a REST and GraphQL API.

## Documentation

[Click here to view documentation](http://www.denwilliams.net/homenet-core/)

## Installing and Running

The best way to use now is to install globally:

```
npm install -g @homenet/core node-red-contrib-scenes
```

Then to run:

```
homenet4 /path/to/my/config.json
```

## Adding Plugins

> [Search for plugins on NPM](https://www.npmjs.com/search?q=homenet4-plugin)

`homenet-core` doesn't do much without plugins. Install plugins globally and they will be automatically discovered. Eg:

```
npm install -g @homenet/plugin-hue
```

Plugins are discovered by searching global and local `node_modules` for modules with the keyword `homenet4-plugin`.

example `package.json`:

```json
{
    "keywords": [
        "homenet4-plugin"
    ],
    "homenet4": {
        "plugins": [
            "MyPluginLoader"
        ]
    }
}
```

## Using as a Module

It is also possible to use as an NPM module inside a project. Docs TBD.

## Developer Help

### Clone and Build Locally

Build using Typescript 2.

```
git clone git@github.com:denwilliams/homenet-core.git
cd homenet-core
npm install
npm install -g typescript
tsc
```

### Building Docs Locally

```
npm install -g typedoc
npm run typedoc
```

### Running Tests

```
npm test
```

or

```
node_modules/.bin/ava
```
