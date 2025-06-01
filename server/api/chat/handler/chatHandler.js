export default function chatHandler(ws, message) {
    try {
        let msg = message.toString()

        console.log('Message received:', msg)

        const reply = `🤖 Bot reply: You said "${msg}"`
        ws.send(reply)
    } catch (e) {
        console.error(e)
        ws.send('⚠️ Error processing your message.')
    }
}