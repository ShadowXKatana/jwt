import fs from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('🚀 Starting custom standalone migration script...')
        const sqlFilePath = path.join(__dirname, 'init.sql')
        const sqlScript = fs.readFileSync(sqlFilePath, 'utf8')

        // Split SQL statements by ';' for SQLite (since single string with multiple statements may fail in $executeRawUnsafe)
        const statements = sqlScript
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0)

        for (const statement of statements) {
            console.log(`Executing snippet: ${statement.substring(0, 40).replace(/\n/g, ' ')}...`)
            await prisma.$executeRawUnsafe(statement)
        }

        console.log('✅ Standalone migration completed successfully!')
    } catch (error) {
        console.error('❌ Migration failed:', error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
