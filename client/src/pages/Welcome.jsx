import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = ({ username, setUsername, room, setRoom }) => {
  const navigate = useNavigate();
  const joinRoom = (e) => {
    e.preventDefault();
    if (
      username.trim().length > 0 &&
      room !== "select-room" &&
      room.trim().length > 0
    ) {
      navigate("/chat", { replace: true });
    } else {
      alert("Fill all user info.");
    }
  };
  return (
    <section className="w-full h-screen flex items-center justify-center">
      <div className="w-1/2 bg-gray-50 p-10 rounded-lg">
        <h1 className="text-5xl font-bold text-center text-teal-600 mb-6">
          ROOM.io
        </h1>
        <form onSubmit={joinRoom}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="username.."
              id="username"
              className="border-2 border-teal-600 outline-none p-2.5 rounded-lg w-full text-base font-medium"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3 ">
            <select
              name="room"
              id="room"
              className="border-2 border-teal-600 text-base font-medium rounded-lg focus:ring-teal-800 block w-full p-2.5 text-center"
              onChange={(e) => setRoom(e.target.value)}
            >
              <option value="select-room"> --- Select Room --- </option>
              <option value="js">Javascript</option>
              <option value="node">Node Js</option>
            </select>
          </div>
          <button className="text-center text-base text-white bg-teal-600 py-2.5 rounded-lg font-medium w-full">
            Join Room
          </button>
        </form>
      </div>
    </section>
  );
};

export default Welcome;
