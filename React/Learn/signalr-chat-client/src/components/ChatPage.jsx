import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

const ChatPage = () => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const connect = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5000/chatHub", {
        withCredentials: true, // ⬅️ Allow auth cookies
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connect.on("ReceiveMessage", (user, msg) => {
      setMessages(prev => [...prev, { user, msg }]);
    });

    connect.start()
      .then(() => {
        console.log("SignalR Connected");
        setConnection(connect);
      })
      .catch(err => console.error("SignalR Error", err));

    return () => {
      connect.stop();
    };
  }, []);

  const sendMessage = async () => {
    if (connection) {
      await connection.invoke("SendMessage", "ReactUser", message);
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        {messages.map((m, idx) => (
          <p key={idx}><strong>{m.user}:</strong> {m.msg}</p>
        ))}
      </div>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatPage;
