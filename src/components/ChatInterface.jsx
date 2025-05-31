// src/components/ChatInterface.jsx
import React, { useState, useEffect, useRef } from 'react';

function ChatInterface({ uploadedFile }) {
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const messagesEndRef = useRef(null); // For auto-scrolling

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]); // Scroll when messages change

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    if (!uploadedFile) {
        alert("Please upload a file first before asking questions.");
        return;
    }

    const newMessages = [...messages, { text: inputQuery, sender: 'user' }];
    setMessages(newMessages);
    setInputQuery('');

    // --- Placeholder for Backend/Groq API call ---
    // In a real app, you would send `inputQuery` and `uploadedFile` (or its ID) 
    // to your backend here, which then calls Groq.
    // For now, let's simulate a response.
    setTimeout(() => {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: `Okay, I'm looking into "${inputQuery}" for the file: ${uploadedFile.name}. (This is a simulated response)`, sender: 'ai' }
      ]);
    }, 1000);
    // --- End Placeholder ---
  };

  return (
    <div className="card mt-3">
      <div className="card-header">
        Chat with your Data
        {uploadedFile && <small className="ms-2 text-muted"> (File: {uploadedFile.name})</small>}
      </div>
      <div className="card-body" style={{ height: '400px', overflowY: 'auto' }}>
        {messages.length === 0 && !uploadedFile && (
          <p className="text-center text-muted">Upload a file to start chatting.</p>
        )}
        {messages.length === 0 && uploadedFile && (
          <p className="text-center text-muted">Ask a question about <strong>{uploadedFile.name}</strong>.</p>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded ${
              msg.sender === 'user' ? 'bg-primary text-white ms-auto' : 'bg-light text-dark me-auto'
            }`}
            style={{ maxWidth: '75%', wordWrap: 'break-word' }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Element to scroll to */}
      </div>
      <div className="card-footer">
        <form onSubmit={handleSendMessage}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder={uploadedFile ? "Ask a question..." : "Upload a file first..."}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={!uploadedFile}
            />
            <button className="btn btn-primary" type="submit" disabled={!inputQuery.trim() || !uploadedFile}>
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatInterface;