import http from 'http'
import app from './server/index.js'
import dotenv from 'dotenv'
import createWebSocketServer from './server/websocket/index.js'

dotenv.config()

const port = process.env.PORT
const server = http.createServer(app)

createWebSocketServer(server)
server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})