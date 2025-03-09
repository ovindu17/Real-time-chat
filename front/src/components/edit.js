import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './edit.css';

function EditProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    interests: [],
    imageUrl: ''
  });

  useEffect(() => {
    if (location.state?.profile) {
      const { profile } = location.state.profile;
      setFormData({
        age: profile.age,
        gender: profile.gender,
        interests: profile.interests,
        imageUrl: profile.imageUrl
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'interests') {
      setFormData({ ...formData, [name]: value.split(',').map(item => item.trim()) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put('https://backend-lyqe.onrender.com/api/users/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-card">
        <h1 className="edit-title">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label>Age:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Gender:</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Interests (comma-separated):</label>
            <input
              type="text"
              name="interests"
              value={formData.interests.join(', ')}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Image URL:</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>
          <div className="button-group">
            <button type="submit" className="save-button">Save Changes</button>
            <button type="button" className="cancel-button" onClick={() => navigate('/profile')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
