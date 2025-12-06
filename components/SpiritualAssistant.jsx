import React, { useState } from "react";

export default function SpiritualAssistant() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setChat(prev => [...prev, userMsg]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/spiritual-assistant", {
        method: "POST",
        body: JSON.stringify({ message: userMsg.text })
      });

      const data = await res.json();

      const aiMsg = {
        sender: "ai",
        text: data.reply || "The Spirit whispers softly... but something went wrong."
      };

      setChat(prev => [...prev, aiMsg]);
    } catch (e) {
      setChat(prev => [
        ...prev,
        { sender: "ai", text: "I am here, but I could not respond. Please try again." }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20 shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4 text-white">
        ✨ Spiritual AI Assistant
      </h2>

      <div className="h-80 overflow-y-auto p-3 bg-white/5 rounded-md border border-white/10">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`mb-3 p-2 rounded-md text-sm ${
              msg.sender === "user"
                ? "bg-blue-600 text-white self-end"
                : "bg-white/20 text-white"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="text-white opacity-70 animate-pulse mt-2">
            Spiritual AI is thinking…
          </div>
        )}
      </div>

      <div className="flex items-center mt-4 gap-2">
        <input
          type="text"
          className="flex-1 p-2 rounded-md bg-white/20 text-white placeholder-white/50 border border-white/30"
          placeholder="Ask for prayer, encouragement, scriptures…"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-purple-600 text-white rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}
