import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Chat from "./components/Chat";

function App() {
  const storedUser = localStorage.getItem("user");
  const [user, setUser] = useState(
    storedUser && storedUser !== "undefined" ? storedUser : null
  );

  const [showRegister, setShowRegister] = useState(false);

  const toggleDarkMode = () => {
    document.body.classList.toggle("dark-mode");
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

 
  if (!user) {
    return (
      <div className="auth-container">
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
          🌙
        </button>

        {showRegister ? (
          <div>
            <Register setUser={setUser} />
            <p>
              Already have an account?{" "}
              <button onClick={() => setShowRegister(false)}>Login</button>
            </p>
          </div>
        ) : (
          <div>
            <Login setUser={setUser} />
            <p>
              Don't have an account?{" "}
              <button onClick={() => setShowRegister(true)}>Register</button>
            </p>
          </div>
        )}
      </div>
    );
  }


  return (
    <div>
      <Chat user={user} />

      <button
        onClick={logout}
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          background: "#f44336",
          color: "#fff",
          padding: "8px 12px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          zIndex: 100,
        }}
      >
        Logout
      </button>

      <button
        onClick={toggleDarkMode}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          background: "#4caf50",
          color: "#fff",
          padding: "8px 12px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          zIndex: 100,
        }}
      >
        🌙
      </button>
    </div>
  );
}

export default App;
