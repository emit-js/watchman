# @emit-js/watchman

emit watchman triggers

![watchman](watchman.gif)

## Install

```bash
npm install -g @emit-js/cli @emit-js/spawn @emit-js/watchman
```

You'll also need to start watchman (`brew install watchman`).

## Usage

In the examples below, we want to trigger `npm run build` when `*.js` changes:

```js
emit watchman --glob="*.js" --command=npm --args=run --args=build
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
emit watchman --script=build
```
