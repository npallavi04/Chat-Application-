// Sidebar.js
import React from "react";

function Sidebar({ onlineUsers, currentChat, setCurrentChat, user }) {
  return (
    <div className="sidebar">
      <h3>Online Users</h3>
      {onlineUsers.length === 0 && <p>No users online</p>}
      {onlineUsers.map(u => (
        <div
          key={u}
          className={`user ${u === currentChat ? "active" : ""}`}
          onClick={() => setCurrentChat(u)}
        >
          {u}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
