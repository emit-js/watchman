# @dot-event/watchman

![watchman](watchman.gif)

## Install

```bash
npm install -g @dot-event/cli @dot-event/spawn @dot-event/watchman
```

You'll need to start watchman (`brew install watchman`).

## Usage

In the examples below, we want to trigger `npm run build` when `*.js` changes:

```js
dot watchman --glob="*.js" --command=npm --args=run --args=build
```

## Detect glob from script entry

If you have a `package.json` script with the glob somewhere in it:

```json
{
  "scripts": {
    "build": "babel *.js --out-dir dist --source-maps"
  }
}
```

The `--script` option is a quick way to add a trigger:

```js
dot watchman --script=build
```
