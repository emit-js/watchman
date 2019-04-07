/* eslint-env jest */

const emit = require("@emit-js/emit")()

require("@emit-js/log")(emit)
require("../")(emit)

describe("watchmanTrigger", function() {
  test("without command", () => {
    expect(emit.watchmanTrigger({})).rejects.toThrow(
      expect.any(Error)
    )
  })

  test("with command", async () => {
    expect(
      await emit.watchmanTrigger({ command: "ls" })
    ).toEqual({
      command: ["ls"],
      expression: ["anyof"],
      name: "default",
    })
  })

  test("with args, command, cwd, and glob", async () => {
    expect(
      await emit.watchmanTrigger({
        args: "-lah",
        command: "ls",
        glob: "*.js",
        path: `${__dirname}/fixture`,
      })
    ).toEqual({
      command: ["ls", "-lah"],
      expression: ["anyof", ["match", "*.js", "wholename"]],
      name: "fixture",
    })
  })

  test("with script", async () => {
    expect(
      await emit.watchmanTrigger({
        path: `${__dirname}/fixture`,
        script: "ls",
      })
    ).toEqual({
      command: ["npm", "run", "ls"],
      expression: [
        "anyof",
        ["match", "**/*.js", "wholename"],
        ["match", "*.jsx", "wholename"],
      ],
      name: "ls",
    })
  })
})
