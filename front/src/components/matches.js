import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './matches.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faComments, faHeart } from '@fortawesome/free-solid-svg-icons';

const Matches = () => {
  const [users, setUsers] = useState([]);
  const [likedUsers, setLikedUsers] = useState([]);
  const [showLiked, setShowLiked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users from your backend
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      const response = await axios.get('https://backend-lyqe.onrender.com/api/users/all-users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message);
    }
  };

  
  const getUsers = async (userIds) => {
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      const response = await axios.post('https://backend-lyqe.onrender.com/api/users/get-users-by-ids', 
        { userIds },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching selected users:', error.response?.data || error.message);
    }
  };

  const handleLike = async (userId) => {
    try {
      // Add like to backend
      await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      setLikedUsers([...likedUsers, userId]);
    } catch (error) {
      console.error('Error liking user:', error);
    }
  };

  const displayedUsers = showLiked 
    ? users.filter(user => likedUsers.includes(user._id))
    : users;

  return (
    <>
      <nav className="nav-bar">
        <div className="nav-item" onClick={() => navigate('/matches')}>
          <FontAwesomeIcon icon={faHeart} />
        </div>
        <div className="nav-item" onClick={() => navigate('/messages')}>
          <FontAwesomeIcon icon={faComments} />
        </div>
        <div className="nav-item "  onClick={() => navigate('/profile')}>
          <FontAwesomeIcon icon={faUser} />
        </div>
      </nav>
      <div className="matches-container">
        <div className="toggle-menu">
          <button 
            className={!showLiked ? 'active' : ''} 
            onClick={() => setShowLiked(false)}
          >
            All
          </button>
          <button 
            className={showLiked ? 'active' : ''} 
            onClick={() => setShowLiked(true)}
          >
            Liked
          </button>
        </div>
        <div className="users-grid">
          {displayedUsers.map(user => (
            <div key={user._id} className="user-card">
              <img src={user.profileImage} alt={user.name} />
              <h3>{user.username}</h3>
              <h3>{user.age}</h3>
              <button 
                className={`like-button ${likedUsers.includes(user._id) ? 'liked' : ''}`}
                onClick={() => handleLike(user._id)}
                disabled={likedUsers.includes(user._id)}
              >
                {likedUsers.includes(user._id) ? 'Liked' : 'Like'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Matches;
