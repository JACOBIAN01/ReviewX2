import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import "./App.css"; // optional for Tailwind imports

const socket = io("http://localhost:5000");

function App() {
  const [sessionId] = useState(uuidv4());
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState({ Name: "", Picture: "" });
  const [projectCount, setProjectCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  // const [reviewMsg, setReviewMsg] = useState("");
  const [reviewTracker, setReviewTracker] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    socket.on("User_Details", (data) => setUser(data));
    socket.on("Project_Count_Update", (count) => setProjectCount(count));
    socket.on("review_update", (msg) => {
      setNotifications((prev) => [...prev, `🔔 ${msg}`]);
    });
    socket.on("review_tracker", (msg) => setReviewTracker(msg));
  }, []);

  const startReview = () => {
    if (!number || !password) return alert("⚠️ Fill all fields");
    setReviewing(true);
    socket.emit("start_review", { number, password, session_id: sessionId });
  };

  const cancelReview = () => {
    setReviewing(false);
    socket.emit("Cancel_Review", { session_id: sessionId });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#FFE0C3] to-[#FFB6A3] p-5 flex justify-center items-center gap-8">
      {/* Profile */}
      <div className="bg-white rounded-lg w-96 p-6 flex flex-col items-center border border-cyan-300 shadow-sm">
        <h2 className="text-xl font-semibold text-cyan-700 px-4 py-2 rounded-xl bg-gray-100">
          User Profile
        </h2>
        <img
          src={user.Picture}
          alt="User"
          className="h-24 w-24 rounded-full border-2 border-cyan-400 object-cover mt-4"
        />
        <p className="mt-4 text-xl font-semibold text-gray-900 text-center truncate">
          {user.Name}
        </p>
        <p className="mt-8 text-lg font-medium text-gray-700">Pending Projects</p>
        <p className="mt-3 bg-cyan-600 text-white text-3xl font-bold rounded-full w-20 h-12 flex items-center justify-center">
          {projectCount}
        </p>
      </div>

      {/* Review Controls */}
      <div className="bg-white rounded-lg w-96 p-6 flex flex-col items-center border border-orange-400 shadow-sm gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 text-center">
          AI-Powered Review for Codingal Projects
        </h1>
        <input
          type="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Enter Phone Number"
          className="w-full px-4 py-2 border border-orange-400 rounded-md text-center"
        />
        <div className="relative w-full">
          <input
            type={passwordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            className="w-full px-4 py-2 border border-orange-400 rounded-md text-center"
          />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-orange-500"
          >
            {passwordVisible ? "🙈" : "👁️"}
          </button>
        </div>
        <div className="flex gap-4">
          <button
            onClick={cancelReview}
            disabled={!reviewing}
            className="px-6 py-2 border border-orange-400 text-orange-600 rounded-md font-semibold hover:bg-orange-50"
          >
            Cancel
          </button>
          <button
            onClick={startReview}
            disabled={reviewing}
            className="px-6 py-2 bg-orange-600 text-white rounded-md font-semibold hover:bg-orange-700"
          >
            Review Project
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg w-96 p-4 flex flex-col shadow-sm overflow-y-auto max-h-96 border border-cyan-300">
        <h2 className="text-center font-semibold text-cyan-700 px-2 py-4 text-xl rounded-xl bg-gray-100">
          Notification
        </h2>
        <div className="space-y-2 mt-2">
          {notifications.map((msg, idx) => (
            <p
              key={idx}
              className="font-semibold bg-cyan-300 p-2 rounded-xl shadow-sm shadow-black"
            >
              {msg}
            </p>
          ))}
        </div>
      </div>

      {/* Review Tracker */}
      {reviewing && (
        <div className="fixed top-28 w-full max-w-xl h-12 bg-gray-900 rounded-full overflow-hidden mx-auto shadow-lg border border-gray-700">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 via-pink-500 to-purple-600"
            style={{ width: "100%", transition: "width 8s linear" }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center z-10 text-white font-semibold">
            {reviewTracker}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
