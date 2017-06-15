# Homenet Core

**This project is in a state of flux while it is going under a BIG restructure/rewrite in order to make everything more flexible and pluggable (see branch v4_rewrite). The new version has drastically different API and structure, but is still very tightly coupled to Node-RED for rule processing.**

## Documentation

[Click here to view documentation](http://www.denwilliams.net/homenet-core/)

## Installing

The best way to use now is to install globally:

```
npm install -g homenet-core
```

Then to run:

```
homenet4
```

## Adding Plugins

`homenet-core` doesn't do much without plugins. Install plugins globally and they will be automatically discovered. Eg:

```
npm install -g homenet-plugin-hue
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
