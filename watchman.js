const { basename, join } = require("path")
const { readJson } = require("fs-extra")

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
  var cwd = arg.cwd,
    del = arg.del

  var trigger = await buildTrigger(prop, arg)

  if (del) {
    return dot.spawn(prop, {
      args: ["trigger-del", cwd, trigger.name],
      cli: true,
      command: "watchman",
    })
  } else {
    var payload = ["trigger", cwd, trigger]

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
  var args = arg.args,
    command = arg.command,
    cwd = arg.cwd,
    glob = arg.glob,
    name = arg.name,
    script = arg.script

  if (script) {
    var pkg = await readJson(join(cwd, "package.json"))

    if (pkg.scripts && pkg.scripts[script]) {
      command = command || "npm"
      args = args || ["run", script]
      glob =
        glob || pkg.scripts[script].match(/[/*]+\.\w+/gi)
    }
  }

  var trigger = {
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
