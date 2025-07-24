import * as path from "path"
import { readFile, writeFile } from "fs/promises"

type EnvRows = Record<string, string>

const parseEnvFile = (content: string): EnvRows => {
  const result: EnvRows = {}

  const lines = content.split("\n")

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (!trimmedLine || trimmedLine.startsWith("#")) continue

    const equalsIndex = trimmedLine.indexOf("=")
    if (equalsIndex === -1) continue

    const key = trimmedLine.slice(0, equalsIndex).trim()
    let value = trimmedLine.slice(equalsIndex + 1).trim()

    const surroundedByQoutes =
      stringSurroundedBy(value, '"') || stringSurroundedBy(value, "'")
    if (surroundedByQoutes) value = value.slice(1, -1)

    result[key] = value
  }

  return result
}

const stringSurroundedBy = (value: string, char: string): boolean => {
  return value.startsWith(char) && value.endsWith(char)
}

const stringifyEnvVars = (env: EnvRows): string => {
  return Object.entries(env)
    .map(([key, value]) => {
      if (value.includes(' ')) value = `"${value}"`

      return `${key}=${value}`
    })
    .join("\n")
}

export class EnvEditor {
  private filePath: string
  private lines: EnvRows

  private constructor(filePath: string, lines: EnvRows) {
    this.filePath = filePath
    this.lines = lines
  }

  static async load(filePath = ".env"): Promise<EnvEditor> {
    const fullPath = path.resolve(process.cwd(), filePath)

    let content = ""

    try {
      content = await readFile(fullPath, "utf-8")
    } catch {
      content = ""
    }

    const lines = parseEnvFile(content)

    return new EnvEditor(fullPath, lines)
  }

  set(key: string, value: string | number | boolean) {
    this.lines[key] = value.toString()
    return this
  }

  get(key: string) {
    return this.lines[key]
  }

  has(key: string) {
    return !!this.lines[key]
  }

  delete(key: string) {
    delete this.lines[key]
    return this
  }

  preview(): string {
    return stringifyEnvVars(this.lines)
  }

  async save(): Promise<void> {
    await writeFile(this.filePath, this.preview(), "utf-8")
  }
}
