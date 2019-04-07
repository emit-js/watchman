module.exports = function(emit) {
  if (emit.watchmanPath) {
    return
  }

  emit.any("watchmanPath", watchmanPath)
}

async function watchmanPath(arg, prop, emit) {
  const { del, path } = arg,
    trigger = await emit.watchmanTrigger(prop, arg)

  if (!trigger) {
    return
  }

  if (del) {
    return emit.spawn(prop, {
      args: ["trigger-del", path, trigger.name],
      cli: true,
      command: "watchman",
    })
  } else {
    const payload = ["trigger", path, trigger]

    return emit.spawn(prop, {
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
