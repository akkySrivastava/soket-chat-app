import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import ScrollToBottom from "react-scroll-to-bottom";
import { io } from "socket.io-client";

let socket;

const ENDPOINT = "https://chit-chat-socket.herokuapp.com/";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isInterface, setInterface] = useState(false);
  const [messageOther, setMessageOther] = useState("");
  const [sId, setsId] = useState("");
  const [pId, setPid] = useState("");
  const [Pname, setPname] = useState("Alien");
  const [Sname, setSname] = useState("Human");
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.on("connection", (sock) => {
      console.log(sock.id);
    });

    socket.on("connect", () => {
      setPid(socket.id);
    });
  }, []);
  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, pId, Pname, () => {
        setMessage("");
        console.log();
      });
      const body = {
        text: message,
        userId: pId,
        name: Pname,
      };
      if (pId !== "") {
        await axios
          .post("/api/chat", body)
          .then((res) => console.log(res.data));
      }
    }
  };

  const handleSubmitOther = async (e) => {
    e.preventDefault();
    if (messageOther) {
      socket.emit("sendMessage", messageOther, sId, Sname, () =>
        setMessageOther("")
      );
      const body = {
        text: messageOther,
        userId: sId,
        name: Sname,
      };
      if (sId !== "") {
        await axios
          .post("/api/chat", body)
          .then((res) => console.log(res.data));
      }
    }
  };

  const handleInterface = () => {
    socket = io(ENDPOINT);
    setInterface(true);
    socket.on("connection", (sock) => {
      console.log(sock.id);
    });

    socket.on("connect", () => {
      setsId(socket.id);
    });
  };
  const [isEdit, setIsEdit] = useState(false);
  const [isSecondEdit, setIsSecondEdit] = useState(false);
  console.log(messages);
  console.log(sId);
  return (
    <div className="app">
      <div className="app-container">
        <div className="app-container-left">
          <div className="app-top">
            {!isEdit ? (
              <h1>{Pname}</h1>
            ) : (
              <input
                type="text"
                value={Pname}
                onChange={(e) => setPname(e.target.value)}
              />
            )}

            <span
              style={{
                marginLeft: "auto",
              }}
            >
              <h1
                onClick={
                  !isEdit ? () => setIsEdit(true) : () => setIsEdit(false)
                }
              >
                {isEdit ? "✔" : "🖊"}
              </h1>
            </span>
          </div>
          <div className="message-container">
            <ScrollToBottom behavior="smooth" className="messages">
              <div className="message">
                <p>{`Your connection is: ${pId}`}</p>
              </div>
              {messages.map((data) => (
                <div className={`${data.userId === pId ? `you` : `message`}`}>
                  <p>{data.text}</p>
                </div>
              ))}
            </ScrollToBottom>

            <div className="chat-footer">
              <form onSubmit={handleSubmit}>
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  type="text"
                  placeholder="enter your message"
                />
              </form>
            </div>
          </div>
        </div>
        {isInterface && (
          <div className="app-container-left">
            <div className="app-top">
              {!isSecondEdit ? (
                <h1>{Sname}</h1>
              ) : (
                <input
                  type="text"
                  value={Sname}
                  onChange={(e) => setSname(e.target.value)}
                />
              )}

              <span
                style={{
                  marginLeft: "auto",
                }}
              >
                <h1
                  onClick={
                    !isSecondEdit
                      ? () => setIsSecondEdit(true)
                      : () => setIsSecondEdit(false)
                  }
                >
                  {isSecondEdit ? "✔" : "🖊"}
                </h1>
              </span>
            </div>
            <div className="message-container">
              <ScrollToBottom className="messages">
                <div className="message">
                  <p>{`Your connection id: ${sId}`}</p>
                </div>
                {messages.map((data) => (
                  <div className={`${data.userId === sId ? `you` : `message`}`}>
                    <p>{data.text}</p>
                  </div>
                ))}
              </ScrollToBottom>

              <div className="chat-footer">
                <form onSubmit={handleSubmitOther}>
                  <input
                    value={messageOther}
                    onChange={(e) => setMessageOther(e.target.value)}
                    type="text"
                    placeholder="enter your message"
                  />
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <button disabled={isInterface} onClick={handleInterface}>
        {isInterface ? "Disabled" : "Open new Interface"}
      </button>
    </div>
  );
}

export default App;
