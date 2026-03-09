import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { globSync } from 'glob'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(cors())
app.use(express.json())

// Auto-routing configuration
const routesPath = path.join(__dirname, 'routes')
const routeFiles = globSync('**/*.js', { cwd: routesPath })

for (const file of routeFiles) {
    const routeModule = await import(pathToFileURL(path.join(routesPath, file)).href)

    // Transform file path (e.g. users/index.js -> /api/users, auth.js -> /api/auth)
    let routePath = '/api/' + file.replace(/\\/g, '/').replace(/\/index\.js$/, '').replace(/\.js$/, '')

    // Handle root index.js (so it doesn't become /api/index)
    if (routePath === '/api/index') routePath = '/api'

    if (routeModule.default) {
        app.use(routePath, routeModule.default)
        console.log(`[Router] Mapped ${routePath} -> routes/${file}`)
    }
}

// Global Error Handler must be the last middleware
import { errorHandler } from './middleware/error.middleware.js'
app.use(errorHandler)

export default app