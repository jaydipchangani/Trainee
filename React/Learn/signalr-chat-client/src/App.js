import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

function App() {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState('');
  const [toUser, setToUser] = useState('');
  const [message, setMessage] = useState('');
  const [tempUser, setTempUser] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupMessages, setGroupMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('private');

  useEffect(() => {
    if (!user) return;

    const connect = new signalR.HubConnectionBuilder()
      .withUrl(`http://localhost:5000/chatHub?user=${user}`, {
        withCredentials: true,
      })
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    connect.start()
      .then(() => {
        console.log('Connected as', user);

        connect.on('ReceivePrivateMessage', (fromUser, message) => {
          setMessages(prev => [...prev, { sender: fromUser, text: message, isMe: false }]);
        });

        connect.on('ReceiveGroupMessage', (user, message) => {
          setGroupMessages(prev => [...prev, { sender: user, text: message, isMe: user === window.user }]);
        });
        
        setConnection(connect);
      })
      .catch(err => console.error(err));

    // Cleanup on unmount
    return () => {
      connect.stop();
    };
  }, [user]);
  const joinGroup = async () => {
    if (connection && groupName) {
      await connection.invoke('JoinGroup', groupName);
    }
  };
  
  const leaveGroup = async () => {
    if (connection && groupName) {
      await connection.invoke('LeaveGroup', groupName);
    }
  };
  
  const sendGroupMessage = async () => {
    if (connection && groupName && message) {
      await connection.invoke('SendMessageToGroup', groupName, user, message);
      setGroupMessages(prev => [...prev, { sender: user, text: message, isMe: true }]);
      setMessage('');
    }
  };
  const sendPrivateMessage = async () => {
    if (connection && toUser && message) {
      try {
        await connection.invoke('SendPrivateMessage', user, toUser, message);
        setMessages(prev => [...prev, { sender: user, text: message, isMe: true, recipient: toUser }]);
        setMessage('');
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleKeyPress = (e, sendFunction) => {
    if (e.key === 'Enter') {
      sendFunction();
    }
  };

  // Login screen
  if (!user) {
    const handleSetUsername = () => {
      if (tempUser.trim()) {
        setUser(tempUser);
      }
    };
    
    return (
      <div style={{ 
        padding: 20, 
        maxWidth: '400px', 
        margin: '0 auto', 
        marginTop: '100px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        backgroundColor: '#fff'
      }}>
        <h2 style={{ textAlign: 'center', color: '#333' }}>Welcome to Chat App</h2>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Enter your username
          </label>
          <div style={{ display: 'flex' }}>
            <input 
              value={tempUser} 
              onChange={e => setTempUser(e.target.value)}
              placeholder="Type username here"
              style={{ 
                flex: 1, 
                padding: '10px', 
                borderRadius: '4px 0 0 4px',
                border: '1px solid #ddd',
                outline: 'none'
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSetUsername()}
            />
            <button 
              onClick={handleSetUsername}
              style={{ 
                padding: '10px 15px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '0 4px 4px 0',
                cursor: 'pointer'
              }}
            >
              Join
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main chat UI
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '15px 20px', 
        backgroundColor: '#4CAF50', 
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: 0 }}>Chat App - {user}</h2>
      </div>
      
      {/* Tab navigation */}
      <div style={{ 
        display: 'flex', 
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div 
          onClick={() => setActiveTab('private')}
          style={{
            padding: '15px 20px',
            cursor: 'pointer',
            backgroundColor: activeTab === 'private' ? '#f5f5f5' : '#fff',
            borderBottom: activeTab === 'private' ? '3px solid #4CAF50' : 'none',
            fontWeight: activeTab === 'private' ? 'bold' : 'normal',
            flex: 1,
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}
        >
          Private Chat
        </div>
        <div 
          onClick={() => setActiveTab('group')}
          style={{
            padding: '15px 20px',
            cursor: 'pointer',
            backgroundColor: activeTab === 'group' ? '#f5f5f5' : '#fff',
            borderBottom: activeTab === 'group' ? '3px solid #4CAF50' : 'none',
            fontWeight: activeTab === 'group' ? 'bold' : 'normal',
            flex: 1,
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}
        >
          Group Chat
        </div>
      </div>
      
      {/* Tab content */}
      {activeTab === 'private' ? (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flex: 1,
          padding: '20px',
          overflow: 'hidden'
        }}>
          {/* Recipient input */}
          <div style={{ marginBottom: '15px' }}>
            <input
              placeholder="Send to user"
              value={toUser}
              onChange={e => setToUser(e.target.value)}
              style={{ 
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          {/* Messages area */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto',
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '15px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>
                No messages yet. Start a conversation!
              </div>
            ) : (
              messages.map((msg, i) => (
                <div 
                  key={i} 
                  style={{ 
                    display: 'flex',
                    justifyContent: msg.isMe ? 'flex-end' : 'flex-start',
                    marginBottom: '10px'
                  }}
                >
                  <div style={{ 
                    backgroundColor: msg.isMe ? '#4CAF50' : '#e0e0e0',
                    color: msg.isMe ? 'white' : 'black',
                    padding: '10px 15px',
                    borderRadius: msg.isMe ? '18px 18px 0 18px' : '18px 18px 18px 0',
                    maxWidth: '70%',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}>
                    {!msg.isMe && <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>{msg.sender}</div>}
                    {msg.text}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Message input */}
          <div style={{ display: 'flex' }}>
            <input
              placeholder="Type a message..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, sendPrivateMessage)}
              style={{ 
                flex: 1,
                padding: '12px',
                borderRadius: '25px',
                border: '1px solid #ddd',
                outline: 'none',
                marginRight: '10px'
              }}
            />
            <button 
              onClick={sendPrivateMessage}
              style={{ 
                padding: '12px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer'
              }}
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flex: 1,
          padding: '20px',
          overflow: 'hidden'
        }}>
          {/* Group controls */}
          <div style={{ 
            display: 'flex', 
            marginBottom: '15px',
            backgroundColor: '#fff',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <input
              placeholder="Group Name"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              style={{ 
                flex: 1,
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                marginRight: '10px'
              }}
            />
            <button 
              onClick={joinGroup}
              style={{ 
                padding: '10px 15px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Join
            </button>
            <button 
              onClick={leaveGroup}
              style={{ 
                padding: '10px 15px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Leave
            </button>
          </div>
          
          {/* Group messages area */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto',
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '15px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            {groupMessages.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>
                No group messages yet. Join a group to start chatting!
              </div>
            ) : (
              groupMessages.map((msg, i) => (
                <div 
                  key={i} 
                  style={{ 
                    display: 'flex',
                    justifyContent: msg.isMe ? 'flex-end' : 'flex-start',
                    marginBottom: '10px'
                  }}
                >
                  <div style={{ 
                    backgroundColor: msg.isMe ? '#4CAF50' : '#e0e0e0',
                    color: msg.isMe ? 'white' : 'black',
                    padding: '10px 15px',
                    borderRadius: msg.isMe ? '18px 18px 0 18px' : '18px 18px 18px 0',
                    maxWidth: '70%',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}>
                    {!msg.isMe && <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>{msg.sender}</div>}
                    {msg.text}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Group message input */}
          <div style={{ display: 'flex' }}>
            <input
              placeholder="Type a message..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, sendGroupMessage)}
              style={{ 
                flex: 1,
                padding: '12px',
                borderRadius: '25px',
                border: '1px solid #ddd',
                outline: 'none',
                marginRight: '10px'
              }}
            />
            <button 
              onClick={sendGroupMessage}
              style={{ 
                padding: '12px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer'
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
