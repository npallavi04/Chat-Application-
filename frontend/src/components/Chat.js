import { useState, useEffect, useRef } from "react";
import Message from "./Message";
import Sidebar from "./Sidebar";
import { io } from "socket.io-client";

function Chat({ user }) {
  const socketRef = useRef(null);

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState("");

  useEffect(() => {
    socketRef.current = io("http://127.0.0.1:8000", {
      path: "/ws/socket.io",
      transports: ["polling", "websocket"], // allow upgrade
    });

    socketRef.current.on("connect", () => {
      console.log("Connected", socketRef.current.id);
      socketRef.current.emit("join", { user });
    });

    socketRef.current.on("online_users", (users) => {
      console.log("Online users:", users);
      setOnlineUsers(users.filter((u) => u !== user));
    });

    socketRef.current.on("receive_private", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on("typing", (data) => {
      if (data.sender === currentChat) {
        setTyping(`${data.sender} is typing...`);
        setTimeout(() => setTyping(""), 1500);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [user]);

  //SEND MESSAGE
  const send = () => {
    if (!text || !currentChat) return;

    const msgData = {
      sender: user,
      recipient: currentChat,
      text,
      time: new Date().toLocaleTimeString(),
    };

    socketRef.current.emit("private_message", msgData);

    setMessages((prev) => [...prev, msgData]); // show instantly
    setText("");
  };

  return (
    <div className="chat-app">
      <Sidebar
        onlineUsers={onlineUsers}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
        user={user}
      />

      <div className="chat-container">
        <div className="chat-box">
          {messages
            .filter(
              (m) =>
                (m.sender === user && m.recipient === currentChat) ||
                (m.sender === currentChat && m.recipient === user),
            )
            .map((m, i) => (
              <Message key={i} msg={m} user={user} />
            ))}
        </div>

        {typing && <p>{typing}</p>}

        {/* INPUT */}
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);

            if (currentChat) {
              socketRef.current.emit("typing", {
                sender: user,
                recipient: currentChat,
              });
            }
          }}
          placeholder={currentChat ? "Type message..." : "Select a user first"}
        />

        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
