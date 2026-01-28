import express from 'express'
import loger from 'morgan'
import dotenv from 'dotenv'
import mysql from 'mysql2/promise';

import { Server } from 'socket.io'
import { createServer } from 'node:http'

dotenv.config()

const port  = process.env.PORT

const app = express()
const server = createServer(app)
const io = new Server(server, {
    connectionStateRecovery: {}
})

let db
try {
    db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    })
    console.log('✓ Database connected')
} catch (e) {
    console.error('✗ Database connection failed:', e)
    process.exit(1)
}

await db.execute(`CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        message TEXT NOT NULL,
        username TEXT
    )`
)

io.on('connection', async (socket) => {
    console.log('=== A user has connected ===')

    socket.on('disconnect', () => {
        console.log('=== A user has disconnected ===')
    })

    socket.on('chat message', async (msg) => {
        let result
        try {
            const username = socket.handshake.auth.username ?? 'Anonymous'
            const [result] = await db.execute(
                'INSERT INTO messages (message, username) VALUES (?, ?)',
                [msg, username]
            );
            io.emit('chat message', msg, result.insertId.toString(), username)
        }catch (e){
            console.error(e)
            return
        }
    })
    
    if (!socket.recovered) {
        try{
            const [results] = await db.execute(
                'SELECT id, message, username FROM messages WHERE id > ?',
                [socket.handshake.auth.serverOffset ?? 0]
            )
            results.forEach(row => {
                socket.emit('chat message', row.message, row.id.toString(), row.username)
            })
        }catch (e){
            console.error("Error recovering the messages", e)
            return
        }
    }

    socket.on('delete chat', async () => {
        try {
            await db.execute(
                'DELETE FROM messages'
            )
            io.emit('delete chat')
        } catch (error) {
            console.error("Error deleting the message", error)
        }
    })
})


app.use(loger('dev'))

app.use('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
