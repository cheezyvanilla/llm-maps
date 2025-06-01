export default async function chatHandler(ws, message) {
    try {
        let msg = message.toString()

        console.log('Message received:', msg)

        // const reply = `🤖 Bot reply: You said "${msg}"`
        const reply = 
        ws.send(reply)
    } catch (e) {
        console.error(e)
        ws.send('⚠️ Error processing your message.')
    }
}