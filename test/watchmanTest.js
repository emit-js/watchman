/* eslint-env jest */

import watchman from "../"

const dot = require("dot-event")()

require("@dot-event/log")(dot)
watchman(dot)

describe("watchmanTrigger", function() {
  test("without command", () => {
    expect.assertions(1)
    expect(dot.watchmanTrigger({})).rejects.toThrow(
      expect.any(Error)
    )
  })

  test("with command", async () => {
    expect(
      await dot.watchmanTrigger({ command: "ls" })
    ).toEqual({
      command: ["ls"],
      expression: ["anyof"],
      name: "default",
    })
  })

  test("with script", async () => {
    expect(
      await dot.watchmanTrigger({
        cwd: `${__dirname}/fixture`,
        script: "ls",
      })
    ).toEqual({
      command: ["npm", "run", "ls"],
      expression: [
        "anyof",
        ["match", "**/*.js", "wholename"],
        ["match", "*.jsx", "wholename"],
      ],
      name: "fixture",
    })
  })
})
