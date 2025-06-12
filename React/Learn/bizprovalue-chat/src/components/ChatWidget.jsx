import React, { useState, useRef, useEffect } from 'react';

export default function ChatWidget() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I am BizProValue Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const chatButtonRef = useRef(null);
  const [chatHistory, setChatHistory] = useState([]);
// Helper to generate a simple unique ID
const generateMessageId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const sendMessage = async () => {
  if (!input.trim()) return;

  const messageId = generateMessageId(); // 🔐 Generate client-side ID

  const userMessage = { from: 'user', text: input, chatId: messageId };
  setMessages((prev) => [...prev, userMessage]);
  setLoading(true);

  try {
    const response = await fetch('https://localhost:7263/api/chat/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        question: input,
        messageId  // 👈 Pass message ID to API
      }),
    });

    if (!response.ok) throw new Error('Failed to fetch response');

    const data = await response.json();
    //console.log('API Response:', data);

    const botMessage = { 
      from: 'bot', 
      text: data.answer,
      chatId: data.messageId || messageId  // 👈 Fallback to client ID if server doesn't return one
    };
    setMessages((prev) => [...prev, botMessage]);

    setChatHistory((prev) => [...prev, {
      chatId: botMessage.chatId,
      question: input,
      answer: data.answer
    }]);

  } catch (error) {
    console.error('Error in sendMessage:', error);
    setMessages((prev) => [...prev, { from: 'bot', text: 'Sorry, something went wrong.' }]);
  }

  setLoading(false);
  setInput('');
};


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Submit feedback (thumbs up/down) to the API
  const submitFeedback = async (chatId, isPositive) => {
    //console.log('Submitting feedback for chatId:', chatId); // Debug: Check chatId in feedback
    //console.log('Current messages state:', messages); // Debug: Check current messages

    if (!chatId) {
      console.error('No chatId provided for feedback');
      return;
    }

    try {
      const response = await fetch('https://localhost:7263/api/chat/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messageId: chatId,
          feedback: isPositive ? 'positive' : 'negative' 
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Feedback API error:', errorText);
        throw new Error('Failed to submit feedback');
      }
      
      //console.log('Feedback submitted successfully');
      //alert('Thanks for your feedback!');
    } catch (error) {
      console.error('Feedback error:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };


  // Handle mouse down event to start dragging
  const handleMouseDown = (e) => {
    if (isOpen) return; // Don't allow dragging when chat is open
    
    // Prevent default behavior and text selection during drag
    e.preventDefault();
    
    // Calculate the offset of the mouse position relative to the button position
    const rect = chatButtonRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
  };

  // Handle mouse move event during dragging
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    // Calculate new position based on mouse position and drag offset
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Update position state
    setPosition({
      x: Math.max(0, Math.min(window.innerWidth - 60, newX)),
      y: Math.max(0, Math.min(window.innerHeight - 60, newY))
    });
  };

  // Handle mouse up event to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add and remove event listeners for mouse move and up
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    
    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div 
      style={{
        ...styles.widgetContainer,
        bottom: isOpen ? '20px' : `${position.y}px`,
        right: isOpen ? '20px' : `${position.x}px`,
      }}
    >
      {isOpen ? (
        <div style={styles.chatContainer}>
          <div style={styles.header}>
            <h3 style={styles.headerTitle}>BizProValue Assistant</h3>
            <button onClick={toggleChat} style={styles.closeButton}>×</button>
          </div>
          <div style={styles.messagesContainer}>
    {messages.map((msg, idx) => {
      //console.log('Rendering message:', msg); // Debug: Check each message while rendering
      return (
        <div key={idx} style={{
          ...styles.message,
          alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
          backgroundColor: msg.from === 'user' ? '#007bff' : '#f1f0f0',
          color: msg.from === 'user' ? 'white' : 'black',
        }}>
          {msg.text}
          {msg.from === 'bot' && msg.chatId && (
            <div style={styles.feedbackContainer}>
              <button 
  onClick={() => {
    console.log('Feedback button clicked for message:', msg); 
    submitFeedback(msg.chatId, true);  // ✅ FIXED
}} 
  style={styles.feedbackButton}
>
  👍
</button>
<button 
  onClick={() => {
    console.log('Feedback button clicked for message:', msg); 
    submitFeedback(msg.chatId, false);  // ✅ FIXED
}} 
  style={styles.feedbackButton}
>
  👎
</button>

            </div>
          )}
        </div>
      );
    })}
    {loading && <div style={styles.loadingMessage}>Typing...</div>}
  </div>
          <div style={styles.inputContainer}>
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={styles.input}
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading} style={styles.button}>
              Send
            </button>
          </div>
        </div>
      ) : (
        <button 
          ref={chatButtonRef}
          onClick={toggleChat} 
          onMouseDown={handleMouseDown}
          style={{
            ...styles.chatButton,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        >
          <span style={styles.chatButtonIcon}>💬</span>
        </button>
      )}
    </div>
  );
}

const styles = {
  widgetContainer: {
    position: 'fixed',
    zIndex: 1000,
    transition: 'all 0.2s ease-in-out',
  },
  chatButton: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    userSelect: 'none',
    touchAction: 'none',
  },
  chatButtonIcon: {
    fontSize: '24px',
  },
  chatContainer: {
    width: '350px',
    height: '500px',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: 'white',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
  },
  headerTitle: {
    margin: 0,
    fontSize: '16px',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  message: {
    maxWidth: '75%',
    padding: '10px',
    borderRadius: '12px',
    wordBreak: 'break-word',
  },
  feedbackContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '5px',
    gap: '5px',
  },
  feedbackButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '2px 5px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  },
  loadingMessage: {
    alignSelf: 'flex-start',
    padding: '8px 12px',
    borderRadius: '12px',
    backgroundColor: '#f1f0f0',
    color: '#666',
    fontSize: '14px',
  },
  inputContainer: {
    display: 'flex',
    gap: '8px',
    padding: '10px',
    borderTop: '1px solid #eee',
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '14px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  button: {
    padding: '8px 16px',
    fontSize: '14px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
  },
};