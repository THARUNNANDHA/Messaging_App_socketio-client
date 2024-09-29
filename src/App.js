import './css/App.css';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io("http://localhost:5000/");

function App() {
  const [clear, setClear] = useState(false);
  const [usernameyoggle, setUsernameyoggle] = useState(true);
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [info, setInfo] = useState("");
  const [user, setUser] = useState(""); // Initialize user as an empty string

  useEffect(() => {
    socket.emit('messagehistory');
    socket.on('message', (message) => {
      setChat(message);
    });

    socket.on('userLeft', (message) => {
      setInfo(message);
    });

    socket.on('userJoined', (message) => {
      setInfo(message);
    });

    socket.on('getHistory', (message) => {
      setChat(message);
      toggleClearData()
    });
    socket.on('setUser', (name) => {
      setUsernameyoggle(prev => !prev);
    });

    return () => {
      socket.off('message');
      socket.off('userLeft');
      socket.off('userJoined');
      socket.off('getHistory');
      socket.off('setUser');
    };
  }, []); // Ensure this runs only once

  const sendMessage = () => {
    if (msg.trim()) { // Check for non-empty message
      socket.emit('message', msg, user);
      setMsg(''); // Clear the message input
    }
  };

  const handleChanges = (e, setter) => {
    setter(e.target.value);
  };

  const cleardata = (e) => {
    e.preventDefault(); // Prevent default form submission
    socket.emit('cleardata', pass);
    setPass(""); // Clear the password input after sending
  };

  const toggleClearData = () => {
    setClear(prev => !prev);
  };

  const setUsername = (e) => {
    e.preventDefault(); // Prevent default form submission
    socket.emit('Joinuser', user);
  }

  return (
    <div>
      {usernameyoggle ? ( // Change to check for an empty string
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
          <form className="flex flex-col items-center" onSubmit={setUsername}>
            <label className="text-center text-2xl font-bold mb-4">Name</label>
            <input
              type="text"
              value={user}
              onChange={(e) => handleChanges(e, setUser)}
              className="border border-gray-300 rounded-lg py-2 px-4 mb-4 w-52 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username......"
            />
            <button
              type="submit" // Use type="submit" to trigger form submission
              className="text-white bg-rose-600 rounded-lg p-2 px-4 hover:bg-orange-600 transition duration-200"
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        !clear ? (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4">Chat Application</h1>
            <p className="text-lg mb-2"><strong>{info}</strong></p>
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4 mb-4">
              <ul className="max-h-60 overflow-y-auto">
                {chat.map((item) => (
                  <li key={item.id} className="p-2 border-b border-gray-200">
                    <strong>{item.name}:</strong> {item.message}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex w-full max-w-md mb-4">
              <input
                type="text"
                className="border border-gray-300 rounded-l-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={msg}
                onChange={(e) => handleChanges(e, setMsg)}
                placeholder="Type your message..."
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white rounded-r-lg py-2 px-4 hover:bg-blue-600 transition duration-200"
              >
                Send
              </button>
            </div>
            <button
              className="text-white bg-rose-600 rounded-lg p-2 mt-2 hover:bg-orange-600 transition duration-200"
              onClick={toggleClearData}
            >
              Clear Data
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <form className="flex flex-col items-center" onSubmit={cleardata}>
              <label className="text-center text-2xl font-bold mb-4">Password</label>
              <input
                type="password"
                value={pass}
                onChange={(e) => handleChanges(e, setPass)}
                className="border border-gray-300 rounded-lg py-2 px-4 mb-4 w-52 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password..."
              />
              <button
                type="submit" // Use type="submit" to trigger form submission
                className="text-white bg-rose-600 rounded-lg p-2 px-4 hover:bg-orange-600 transition duration-200"
              >
                Send
              </button>
              <button
                type="button"
                onClick={toggleClearData}
                className="text-gray-600 mt-2 underline"
              >
                Cancel
              </button>
            </form>
          </div>
        )
      )}
    </div>
  );
}

export default App;
