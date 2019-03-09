# @dot-event/watchman

![watchman](watchman.gif)

## Install

```bash
npm install -g @dot-event/cli @dot-event/spawn @dot-event/watchman
```

You should already have watchman service running (`brew install watchman`).

## Usage

We want to watch `*.js` for changes and trigger `npm run build`.

The explicit way:

```js
dot watchman --glob="*.js" --command=npm --args=run --args=build
```

The short way (detects glob strings from `package.json` script):

```js
dot watchman --script=build
```
