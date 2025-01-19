import React from "react";

const Message = ({ text, sender }) => {
  return (
    <div
      style={{
        alignSelf: sender === "user" ? "flex-end" : "flex-start",
        backgroundColor: sender === "user" ? "#DCF8C6" : "#ECECEC",
        padding: "10px",
        borderRadius: "5px",
        maxWidth: "70%",
        marginBottom: "10px",
      }}
    >
      {text}
    </div>
  );
};

export default Message;
