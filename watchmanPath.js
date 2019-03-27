module.exports = function(dot) {
  if (dot.watchmanPath) {
    return
  }

  dot.any("watchmanPath", watchmanPath)
}

async function watchmanPath(prop, arg, dot) {
  const { del, path } = arg,
    trigger = await dot.watchmanTrigger(prop, arg)

  if (!trigger) {
    return
  }

  if (del) {
    return dot.spawn(prop, {
      args: ["trigger-del", path, trigger.name],
      cli: true,
      command: "watchman",
    })
  } else {
    const payload = ["trigger", path, trigger]

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
