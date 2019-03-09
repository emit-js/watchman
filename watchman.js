import { readJson } from "fs-extra"
import { basename, join } from "path"

module.exports = function(dot) {
  if (dot.watchman) {
    return
  }

  dot("dependencies", "watchman", {
    arg: ["@dot-event/spawn"],
  })

  dot("alias", "watchman", {
    a: ["args"],
    c: ["command"],
    d: ["del"],
    g: ["glob"],
    n: ["name"],
    s: ["script"],
  })

  dot.any("watchman", watchman)
}

async function watchman(prop, arg, dot) {
  const { cwd, del } = arg,
    trigger = await buildTrigger(prop, arg)

  if (!trigger) {
    return
  }

  if (del) {
    return dot.spawn(prop, {
      args: ["trigger-del", cwd, trigger.name],
      cli: true,
      command: "watchman",
    })
  } else {
    const payload = ["trigger", cwd, trigger]

    return dot.spawn(prop, {
      args: [
        "-c",
        "watchman -j <<-EOT\n" +
          JSON.stringify(payload) +
          "\nEOT",
      ],
      cli: true,
      command: "sh",
    })
  }
}

async function buildTrigger(prop, arg) {
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

  const trigger = {
    command: [command].concat(args),
    expression: ["anyof"],
    name: name || script || basename(cwd),
  }

  glob = Array.isArray(glob) ? glob : [glob]

  glob.forEach(function(g) {
    trigger.expression.push(["match", g, "wholename"])
  })

  return trigger
}
