# Homenet Core

**This project is in a state of flux while it is going under a BIG restructure/rewrite in order to make everything more flexible and pluggable (see branch v4_rewrite). The new version has drastically different API and structure, but is still very tightly coupled to Node-RED for rule processing.**

## Documentation

[Click here to view documentation](http://www.denwilliams.net/homenet-core/)

## Clone and Build Locally

```
git clone git@github.com:denwilliams/homenet-core.git
cd homenet-core
npm install
npm install -g typescript
tsc
```

## Building Docs Locally

```
npm install -g typedoc
npm run typedoc
```

## Running Tests

```
npm test
```

or

```
node_modules/.bin/ava
```

## Using from NPM

```
npm install homenet-core
```
