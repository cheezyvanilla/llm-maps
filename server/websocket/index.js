import { WebSocketServer } from 'ws'
import chatHandler from '../api/chat/handler/chatHandler.js';

export default function createWebSocketServer(server) {
    const wss = new WebSocketServer({ server })

    wss.on('connection', (ws) => {
        console.log('client connected')

        ws.on('message', async (message) => {
            await chatHandler(ws, message)
        });

        ws.on('close', () => {
                console.log('Client disconnected');
        })
    })
}