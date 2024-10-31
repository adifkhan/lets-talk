import React from "react";
import "./typing.css";

const TypingSpinner = () => {
  return (
    <div>
      <div className="chat-bubble">
        <div className="typing">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingSpinner;
