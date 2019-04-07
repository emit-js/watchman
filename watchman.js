module.exports = function(emit) {
  if (emit.watchman) {
    return
  }

  emit("dependencies", "watchman",
    ["@emit-js/glob", "@emit-js/spawn"],
  )

  emit("args", "watchman", {
    args: { alias: "a" },
    command: { alias: "c" },
    del: { alias: "d" },
    glob: { alias: "g" },
    name: { alias: "n" },
    paths: {
      alias: ["_", "p"],
      default: [],
    },
    script: { alias: "s" },
  })

  require("./watchmanPath")(emit)
  require("./watchmanTrigger")(emit)

  emit.any("watchman", watchman)
}

async function watchman(arg, prop, emit) {
  const paths = await emit.glob(prop, {
    absolute: true,
    pattern: arg.paths,
  })

  return Promise.all(
    paths.map(
      async path =>
        await emit.watchmanPath(prop, {
          ...arg,
          path,
          paths,
        })
    )
  )
}
