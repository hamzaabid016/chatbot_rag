import React, { useState, useEffect, useRef } from "react";
import "../css/chat.css"


function Chat() {
  const [messages, setMessages] = useState([]); // Stores chat history
  const [input, setInput] = useState(""); // Stores user input
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return; // Ignore empty messages

    // Add user message to chat history
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    try {
      // Create a bot message placeholder for streaming
      const botMessagePlaceholder = { sender: "bot", text: "", streaming: true };
      setMessages((prev) => [...prev, botMessagePlaceholder]);

      // Use fetch for streaming response
      const response = await fetch ("http://localhost:8000/query-model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: input,
          user_id: "123",
          conversation_id:"456"
        }),
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Create a text decoder for streaming
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const decodedChunk = decoder.decode(value, { stream: true });
        accumulatedResponse += decodedChunk;

        // Update the last message with the accumulated response
        setMessages((prev) => {
          const updatedMessages = [...prev];
          const lastMessageIndex = updatedMessages.length - 1;
          updatedMessages[lastMessageIndex] = {
            sender: "bot",
            text: accumulatedResponse,
            streaming: true,
          };
          return updatedMessages;
        });
      }

      // Mark streaming as complete and finalize the message
      setMessages((prev) => {
        const updatedMessages = [...prev];
        const lastMessageIndex = updatedMessages.length - 1;
        updatedMessages[lastMessageIndex] = {
          sender: "bot",
          text: accumulatedResponse,
          streaming: false,
        };
        return updatedMessages;
      });

      setIsStreaming(false);
    } catch (error) {
      console.error("Error querying model:", error);
      setMessages((prev) => {
        const updatedMessages = [...prev];
        const lastMessageIndex = updatedMessages.length - 1;
        updatedMessages[lastMessageIndex] = {
          sender: "bot",
          text: "Something went wrong. Please try again.",
          streaming: false,
        };
        return updatedMessages;
      });
      setIsStreaming(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.sender === "user" ? "message-user" : "message-bot"
            } ${msg.streaming ? "streaming" : ""}`}
          >
            {msg.text}
            {msg.streaming && <span className="cursor">|</span>}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
      <textarea
      placeholder="Type your message..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.shiftKey) {
          e.preventDefault(); // Prevent form submission
          setInput((prev) => prev + "\n"); // Add a new line
        } else if (e.key === "Enter") {
          e.preventDefault(); // Prevent new line
          sendMessage(); // Send the message
        }
      }}
      className="input-field"
      disabled={isStreaming}
    />

        <button 
  onClick={sendMessage} 
  className="send-button"
  disabled={isStreaming}
  aria-label="Send"
>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="white" 
    width="20px" 
    height="20px"
  >
    <path d="M13 2L20 9H14V22H10V9H4L11 2H13Z" />
  </svg>
</button>
      </div>
    </div>
  );
}

export default Chat;