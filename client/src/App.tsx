import type { User } from "./interface"
import { socket } from "./services/socket";
import Login from "./components/Login";
import { useState } from "react";

const App = () => {

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (username: string) => {
    socket.connect();
    socket.emit("join_room", username);
    setCurrentUser({id: socket.id, username: username})
  }

  const handleLogot = (userName: string) => {
    socket.emit("user_left", userName);
    setCurrentUser(null);
    socket.disconnect();
  }
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Login onLogin={handleLogin}/>

    </div>
  )
}

export default App