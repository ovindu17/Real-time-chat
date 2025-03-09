import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faComments, faHeart } from '@fortawesome/free-solid-svg-icons';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await axios.get('https://backend-lyqe.onrender.com/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Error loading profile');
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleEdit = () => {
    navigate('/edit', { state: { profile } });
  };

  if (error) {
    return (
      <div className="profile-container" style={{ height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>{error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-container" style={{ height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <nav className="nav-bar">
        <div className="nav-item" onClick={() => navigate('/matches')}>
          <FontAwesomeIcon icon={faHeart} />
        </div>
        <div className="nav-item" onClick={() => navigate('/messages')}>
          <FontAwesomeIcon icon={faComments} />
        </div>
        <div className="nav-item active">
          <FontAwesomeIcon icon={faUser} />
        </div>
      </nav>
      <div className="profile-container">
        <div
          className="profile-image"
          style={{ backgroundImage: `url(${profile.profile.imageUrl || 'https://via.placeholder.com/400x400'})` }}
        />
        <div className="profile-info">
          <h1>{profile.username}, {profile.profile.age}</h1>
          <p><strong>Gender:</strong> {profile.profile.gender}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <div className="interests">
            {profile.profile.interests.map((interest, index) => (
              <span key={index} className="interest-tag">{interest}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="bio-container">
        <h2>About Me</h2>
        <p className="bio-text">{profile.profile.bio || 'No bio added yet.'}</p>
        <button className="edit-button" onClick={handleEdit}>
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default Profile;