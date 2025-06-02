import ChatUsecase from "../usecase/chatUsecase.js";

export default class ChatService {
  constructor() {
    this.usecase = new ChatUsecase();
  }

  async chatHandler(ws, message) {
    try {
      let msg = message.toString();

      console.log("Message received:", msg);

      const reply = await this.usecase.processMessage(msg);
      // const reply = `🤖 Bot reply: You said "${msg}"`
      ws.send(reply);
    } catch (e) {
      //   console.error(e);
      console.error("Error processing message");
      ws.send("⚠️ Error processing your message.");
    }
  }
}
