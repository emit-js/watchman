module.exports = function(dot) {
  if (dot.watchman) {
    return
  }

  dot("dependencies", "watchman", {
    arg: ["@dot-event/glob", "@dot-event/spawn"],
  })

  dot("args", "watchman", {
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

  require("./watchmanPath")(dot)
  require("./watchmanTrigger")(dot)

  dot.any("watchman", watchman)
}

async function watchman(prop, arg, dot) {
  const paths = await dot.glob(prop, {
    absolute: true,
    pattern: arg.paths,
  })

  return Promise.all(
    paths.map(
      async path =>
        await dot.watchmanProject(prop, {
          ...arg,
          path,
          paths,
        })
    )
  )
}
