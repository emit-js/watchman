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

  require("./watchmanTrigger")(dot)

  dot.any("watchman", watchman)
}

async function watchman(prop, arg, dot) {
  const { cwd, del } = arg,
    trigger = await dot.watchmanTrigger(prop, arg)

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
