// TODO: Refactor this. Not happy with each test having so many asserts, and reliance on magic strings.

import { describe, it, expect, beforeEach, vi } from "vitest"
import * as path from "path"
import { EnvEditor } from "./env-editor"
import { readFile, writeFile } from "fs/promises"

// Mock fs/promises
vi.mock("fs/promises", () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
}))

describe("EnvEditor", () => {
  const envContent = `
    # Comment line
    FOO=bar
    BAR="baz value"
    NUM=42
    BOOL=true
    QUOTED='quoted'
    SPACED="with spaces"
  `
  // ESCAPED="with \\"quotes\\" and \\\\slashes\\\\"

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("when a valid env file is provided", () => {
    beforeEach(() => {
      ;(readFile as any).mockResolvedValue(envContent)
    })

    it("can use get to fetch values", async () => {
      const editor = await EnvEditor.load()

      expect(editor.get("FOO")).toBe("bar")
      expect(editor.get("BAR")).toBe("baz value")
      expect(editor.get("NUM")).toBe("42")
      expect(editor.get("BOOL")).toBe("true")
      expect(editor.get("QUOTED")).toBe("quoted")
      expect(editor.get("SPACED")).toBe("with spaces")
      // expect(editor.get("ESCAPED")).toBe('with "quotes" and \\slashes\\')
    })

    it("can use has to check for existence", async () => {
      const editor = await EnvEditor.load()

      expect(editor.has("FOO")).toBe(true)
      expect(editor.has("NOT_EXIST")).toBe(false)
    })

    it("sets new values using set and get", async () => {
      const editor = await EnvEditor.load()

      editor.set("NEW_VAR", "new value")
      expect(editor.get("NEW_VAR")).toBe("new value")

      editor.set("NUM_VAR", 100)
      expect(editor.get("NUM_VAR")).toBe("100")

      editor.set("BOOL_VAR", false)
      expect(editor.get("BOOL_VAR")).toBe("false")
    })

    it("updates existing values using set and get", async () => {
      const editor = await EnvEditor.load()

      expect(editor.get("FOO")).toBe("bar")
      editor.set("FOO", "new value")
      expect(editor.get("FOO")).toBe("new value")
    })

    it("deletes existing values using delete and get", async () => {
      const editor = await EnvEditor.load()

      expect(editor.get("FOO")).toBe("bar")
      editor.delete("FOO")
      expect(editor.has("FOO")).toBe(false)
    })
  })

  it("returns empty editor if file does not exist", async () => {
    ;(readFile as any).mockRejectedValue(new Error("not found"))

    const editor = await EnvEditor.load()

    expect(editor.get("FOO")).toBeUndefined()
    expect(editor.preview()).toBe("")
  })

  it("stringifies env vars with quotes and escapes", async () => {
    ;(readFile as any).mockResolvedValue("")

    const editor = await EnvEditor.load()

    editor.set("SPACED", "hello world")
    editor.set("HASH", "value#with#hash")
    editor.set("QUOTE", 'value"with"quotes')
    editor.set("BACKSLASH", "value\\with\\backslash")

    const preview = editor.preview()

    expect(preview).toContain('SPACED="hello world"')
    expect(preview).toContain('HASH="value#with#hash"')
    expect(preview).toContain('QUOTE="value\\"with\\"quotes"')
    expect(preview).toContain('BACKSLASH="value\\\\with\\\\backslash"')
  })

  it("saves env file", async () => {
    ;(readFile as any).mockResolvedValue("")

    const editor = await EnvEditor.load()

    editor.set("FOO", "bar")
    await editor.save()

    expect(writeFile).toHaveBeenCalledWith(
      path.resolve(process.cwd(), ".env"),
      expect.stringContaining("FOO=bar"),
      "utf-8",
    )
  })
})
