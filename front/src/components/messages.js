import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import './Messages.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faComments, faHeart } from '@fortawesome/free-solid-svg-icons';

const UserListModal = ({ users, onClose, onSelectUser }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <div className="modal-header">
        <h3>Start New Chat</h3>
        <button onClick={onClose}>×</button>
      </div>
      <div className="modal-body">
        {users.map(user => (
          <div 
            key={user._id} 
            className="user-item"
            onClick={() => {
              onSelectUser(user);
              onClose();
            }}
          >
            {user.username}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Messages = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showUserList, setShowUserList] = useState(false);
  const [showOtherUsers, setShowOtherUsers] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    fetchChatUsers();
  }, []);

  const getCurrentUserId = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.id || decoded._id || decoded.sub || decoded.user?._id || decoded.user?.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  useEffect(() => {
    const newSocket = io('https://backend-lyqe.onrender.com');
    setSocket(newSocket);

    const userId = getCurrentUserId();
    console.log('Current user ID:', userId);
    
    if (userId) {
      newSocket.emit('join', userId);
      
      newSocket.on('receive_message', (message) => {
        console.log('Received message:', message);
        setMessages(prevMessages => {
          const messageExists = prevMessages.some(m => m._id === message._id);
          if (messageExists) return prevMessages;
          return [...prevMessages, message];
        });
      });
    }

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchChatUsers = async () => {
    try {
      const response = await axios.get('https://backend-lyqe.onrender.com/api/messages/chat-users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const chatUserIds = response.data;
      console.log('Chat user IDs:', chatUserIds);
      
      const usersResponse = await axios.get('https://backend-lyqe.onrender.com/api/users/all-users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const allUsers = usersResponse.data;
      console.log('All users:', allUsers);
      
      const chatUsersData = allUsers.filter(user => chatUserIds.includes(user._id));
      const otherUsers = allUsers.filter(user => !chatUserIds.includes(user._id));
      
      console.log('Chat users data:', chatUsersData);
      setChatUsers(chatUsersData);
      setUsers(otherUsers);
      setShowUserList(true);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchUsers = fetchChatUsers;

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`https://backend-lyqe.onrender.com/api/messages/${selectedUser._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const response = await axios.post(
        'https://backend-lyqe.onrender.com/api/messages/send',
        {
          recipientId: selectedUser._id,
          content: newMessage.trim()
        },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setNewMessage('');
        socket.emit('new_message', {
          ...response.data,
          recipientId: selectedUser._id,
          sender: getCurrentUserId()
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleStartNewChat = async () => {
    await fetchUsers();
    setShowModal(true);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setShowModal(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="page-container">
      <nav className="nav-bar">
        <div className="nav-item" onClick={() => navigate('/matches')}>
          <FontAwesomeIcon icon={faHeart} />
        </div>
        <div className="nav-item active">
          <FontAwesomeIcon icon={faComments} />
        </div>
        <div className="nav-item" onClick={() => navigate('/profile')}>
          <FontAwesomeIcon icon={faUser} />
        </div>
      </nav>
      <div className={`messages-container ${isMobile && selectedUser ? 'mobile-chat-active' : ''}`}>
        {(!isMobile || !selectedUser) && (
          <div className="chat-sidebar">
            <div className="chat-header">
              <h2>Messages</h2>
              <button className="new-chat-button" onClick={handleStartNewChat}>
                Start New Chat
              </button>
            </div>
            <div className="user-list">
              {chatUsers.map(user => (
                <div 
                  key={user._id} 
                  className={`user-item ${selectedUser?._id === user._id ? 'selected' : ''}`}
                  onClick={() => setSelectedUser(user)}
                >
                  <span className="username">{user.username}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedUser && (
          <div className="chat-container">
            <div className="chat-header">
              <h3>Chat with {selectedUser.username}</h3>
              <button onClick={() => setSelectedUser(null)}>←</button>
            </div>
            <div className="messages-list">
              {messages.map(message => (
                <div 
                  key={message._id}
                  className={`message ${message.sender === selectedUser._id ? 'received' : 'sent'}`}
                >
                  {message.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="message-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button type="submit">Send</button>
            </form>
          </div>
        )}

        {showModal && (
          <UserListModal 
            users={users}
            onClose={() => setShowModal(false)}
            onSelectUser={handleSelectUser}
          />
        )}
      </div>
    </div>
  );
};

export default Messages;
