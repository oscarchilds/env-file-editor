# env-file-editor

env-file-editor provides a simple way of interacting with local `.env` files.

# Installation

```
npm install env-file-editor
```

# Usage

```
import { EnvEditor } from 'env-file-editor'

const env = await EnvEditor.load('.env')
env.set('my-key', 'my-value')
await env.save()
```

# Documentation

### EnvEditor.load(filePath)
