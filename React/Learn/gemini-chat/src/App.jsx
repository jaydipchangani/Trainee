import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {
  const [messages, setMessages] = useState([
    { sender: "system", text: "You are an expert data extraction and business intelligence agent..." }
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  // Scroll to bottom on messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    setMessages((msgs) => [...msgs, { sender: "user", text: input }]);

    try {
      const response = await axios.post("/api/chat", { message: input });
      setMessages((msgs) => [...msgs, { sender: "gemini", text: response.data.response }]);
    } catch (error) {
      setMessages((msgs) => [...msgs, { sender: "gemini", text: "Error contacting Gemini API." }]);
    }

    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={styles.container}>
      <h1>Gemini Chat</h1>
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#DCF8C6" : "#E6E6E6"
            }}
          >
            <strong>{msg.sender === "user" ? "You" : msg.sender === "system" ? "System" : "Gemini"}:</strong> {msg.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <input
        type="text"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        style={styles.input}
      />
      <button onClick={sendMessage} style={styles.button}>Send</button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    padding: 20
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    border: "1px solid #ccc",
    padding: 10,
    marginBottom: 10,
    display: "flex",
    flexDirection: "column"
  },
  message: {
    maxWidth: "80%",
    padding: 10,
    margin: "5px 0",
    borderRadius: 8
  },
  input: {
    padding: 10,
    fontSize: 16,
    width: "calc(100% - 90px)",
    marginRight: 10,
    borderRadius: 5,
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px 20px",
    fontSize: 16,
    borderRadius: 5,
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer"
  }
};

export default App;
