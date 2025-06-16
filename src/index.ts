type EnvVars = Record<string, string>

const stringSurroundedBy = (value: string, char: string): boolean => {
  return value.startsWith(char) && value.endsWith(char)
}

const parseEnvFile = (content: string): EnvVars => {
  const result: EnvVars = {}

  const lines = content.split('\n')

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (!trimmedLine || trimmedLine.startsWith('#')) continue

    const equalsIndex = trimmedLine.indexOf('=')
    if (equalsIndex === -1) continue

    const key = trimmedLine.slice(0, equalsIndex).trim()
    let value = trimmedLine.slice(equalsIndex + 1).trim()

    const surroundedByQoutes = stringSurroundedBy(value, '"') || stringSurroundedBy(value, "'")
    if (surroundedByQoutes) value = value.slice(1, -1)

    result[key] = value
  }

  return result
}

const stringifyEnvVars = (env: Record<string, string>): string => {
  return Object.entries(env)
    .map(([key, value]) => {
      const needsQuotes = /[\s#"'`\\]/.test(value)
      const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')

      return `${key}=${needsQuotes ? `"${escaped}"` : value}`
    })
    .join('\n')
}

const addEnv = (envFile: string, key: string, value: string): string => {
  const content = parseEnvFile(envFile)

  content[key] = value

  return stringifyEnvVars(content)
}

export {
  addEnv
}