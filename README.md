# env-file-editor

[![NPM Version](https://img.shields.io/npm/v/env-file-editor)](https://www.npmjs.com/package/env-file-editor)

env-file-editor provides a simple way of interacting with local `.env` files.

# Installation

```
npm install env-file-editor
```

# Usage

```typescript
import { EnvEditor } from "env-file-editor"

// Load an .env file
const env = await EnvEditor.load(".env")

// Set a key-value pair
env.set("my-key", "my-value")

// Get a value by key
console.log(env.get("my-key")) // Output: 'my-value'

// Check if a key exists
console.log(env.has("my-key")) // Output: true

// Delete a key
env.delete("my-key")

// Preview the current .env content
console.log(env.preview())

// Save changes back to the .env file
await env.save()
```

# API

## `EnvEditor`

### Static Methods

- **`EnvEditor.load(filePath?: string): Promise<EnvEditor>`**
  - Loads an `.env` file from the specified path (default: `.env`).
  - Returns an instance of `EnvEditor`.

### Instance Methods

- **`set(key: string, value: string | number | boolean): this`**
  - Sets a key-value pair in the `.env` file.

- **`get(key: string): string | undefined`**
  - Retrieves the value associated with a key.

- **`has(key: string): boolean`**
  - Checks if a key exists in the `.env` file.

- **`delete(key: string): this`**
  - Deletes a key-value pair from the `.env` file.

- **`preview(): string`**
  - Returns a string representation of the `.env` file content.

- **`save(): Promise<void>`**
  - Saves the current state of the `.env` file to disk.

# Testing

The library includes a comprehensive test suite using `vitest`. To run the tests:

```
npm test
```

# Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.
