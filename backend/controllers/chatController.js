// backend/controllers/chatController.js

export const handleChat = async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Call local Ollama model (phi3) with streaming response
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "phi3",
        prompt: `You are an empathetic mental health companion. 
Always reply with warmth, encouragement, and short, supportive suggestions. 
Do not sound like a generic AI assistant. Keep responses conversational and human-like.
User: ${userMessage}
Companion:`,
        stream: true, // important: stream response
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Ollama API Error:", errText);
      return res.status(500).json({
        reply: "I’m here for you, but I’m having trouble connecting to the AI model right now.",
        error: errText,
      });
    }

    // Ollama streams JSON objects line by line
    const reader = response.body.getReader();
    let botReply = "";
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });

      // Split stream into lines and parse each one
      const lines = chunk.split("\n").filter((line) => line.trim() !== "");
      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.response) {
            botReply += data.response;
          }
        } catch (err) {
          console.error("Stream parse error:", err, line);
        }
      }
    }

    botReply = botReply.trim() || "I'm here with you.";

    return res.json({
      reply: botReply,
      emotion: "neutral", // later hook emotion analyzer here
    });
  } catch (error) {
    console.error("Chat error:", error);
    return res.status(500).json({
      reply: "Something went wrong, but I’m here to listen.",
      error: error.message,
    });
  }
};
