import { readJson } from "fs-extra"
import { basename, join } from "path"

module.exports = function(dot) {
  if (dot.watchmanTrigger) {
    return
  }

  dot.any("watchmanTrigger", watchmanTrigger)
}

async function watchmanTrigger(prop, arg) {
  const { cwd, name, script } = arg
  var { args, command, glob } = arg

  if (script) {
    const pkg = await readJson(join(cwd, "package.json"))

    if (pkg.scripts && pkg.scripts[script]) {
      command = command || "npm"
      args = args || ["run", script]
      glob =
        glob || pkg.scripts[script].match(/[/*]+\.\w+/gi)
    } else {
      return
    }
  }

  if (!command) {
    throw new Error("Watchman needs a command or script.")
  }

  const trigger = {
    command: [command].concat(args || []),
    expression: ["anyof"],
    name: name || script || cwd ? basename(cwd) : "default",
  }

  if (glob) {
    glob = Array.isArray(glob) ? glob : [glob]

    glob.forEach(function(g) {
      trigger.expression.push(["match", g, "wholename"])
    })
  }

  return trigger
}
