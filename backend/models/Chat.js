import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  message: { type: String, required: true },
  emotion: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
