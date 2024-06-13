import React, { useState } from "react";
import "../styles/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGreaterThan,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

function GptUI() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isCollapsed, setisCollapsed] = useState(false);
  const [history, setHistory] = useState("");

  const handleMessageSubmit = async () => {
    const prompt = {
      role: "user",
      content: inputText,
    };

    setMessages([...messages, prompt]);
    console.log("test", `${process.env.REACT_APP_OPENAI_API_KEY}`);

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [...messages, prompt],
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        const res = data.choices[0].message.content;
        setMessages((messages) => [
          ...messages,
          {
            role: "assistant",
            content: res,
          },
        ]);
        setHistory((history) => [
          ...history,
          { question: inputText, answer: res },
        ]);
        setInputText("");
      });
  };

  const expandRightMenu = () => {
    setisCollapsed(!isCollapsed);
  };

  return (
    <div className="App flex">
      <section
        className={
          "right-section width-30" + " " + (isCollapsed ? "hidden" : "")
        }
      >
        <div className="flex">
          <h5>New Chat</h5>
          {!isCollapsed ? (
            <button className="noBackgroundNoBorder">
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>
          ) : (
            ""
          )}
        </div>
      </section>
      {isCollapsed ? (
        <button
          className="largeFont"
          style={{
            background: "none",
            border: "1px solid black",
            height: "fit-content",
          }}
        >
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
      ) : (
        ""
      )}
      <button onClick={expandRightMenu} className="noBackgroundNoBorder">
        <FontAwesomeIcon
          icon={faGreaterThan}
          style={{
            top: "50%",
            position: "fixed",
            left: !isCollapsed ? "30%" : "1%",
            transform: !isCollapsed ? "rotate(180deg)" : "",
          }}
        />
      </button>
      <section
        className={
          "left-section width-70 flex flex-column" +
          " " +
          (isCollapsed ? "centerMessage" : "")
        }
      >
        <div className="chat-area" style={{ height: "80vh" }}>
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.text}
            </div>
          ))}
        </div>
        <div className="input-area flex noBackgroundNoBorder">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="input-box"
          />
          <button onClick={handleMessageSubmit} className="send-btn">
            Send
          </button>
        </div>
      </section>
    </div>
  );
}

export default GptUI;
