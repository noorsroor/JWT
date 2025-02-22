import { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  // Signup Function
  const handleSignup = async () => {
    const res = await fetch("http://localhost:9000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    alert(data.message);
  };

  // Login Function
  const handleLogin = async () => {
    const res = await fetch("http://localhost:9000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Allow cookies
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) setUser(username);
    alert(data.message);
  };

  // Fetch Profile Function
  const fetchProfile = async () => {
    const res = await fetch("http://localhost:9000/profile", {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    if (res.ok) setUser(data.message);
    else alert("You need to log in!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        {user ? (
          <h2 className="text-2xl font-bold text-center text-purple-500">{user}</h2>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-center mb-4">Signup / Login</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 mb-3 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-3 border rounded"
            />
            <div className="flex justify-between">
              <button onClick={handleSignup} className="bg-pink-700 text-white px-4 py-2 rounded">
                Signup
              </button>
              <button onClick={handleLogin} className="bg-pink-500 text-white px-4 py-2 rounded">
                Login
              </button>
            </div>
            <button
              onClick={fetchProfile}
              className="mt-3 w-full bg-purple-500 text-white px-4 py-2 rounded"
            >
              Check Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
