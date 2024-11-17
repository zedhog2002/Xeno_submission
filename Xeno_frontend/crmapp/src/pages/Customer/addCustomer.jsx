import React, { useState } from 'react';
import axios from 'axios';
import './addCustomer.css'; // Optional: Add styling
import API_BASE_URL from '../globals';

const AddCustomer = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    address: '',
    spent: '',
    visits: '',
    most_frequent: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      return 'Invalid email format';
    }
    if (!formData.phone || formData.phone.length !== 10) {
      return 'Phone number must be exactly 10 digits';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setMessage('');
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/customers/reg`, formData);
      setMessage(response.data.message);
      setError('');
      setFormData({
        name: '',
        age: '',
        email: '',
        phone: '',
        address: '',
        spent: '',
        visits: '',
        most_frequent: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating customer');
      setMessage('');
    }
  };

  return (
    <div className="add-customer-container">
      <h2>Add Customer</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Spent:</label>
          <input
            type="number"
            name="spent"
            value={formData.spent}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Visits:</label>
          <input
            type="number"
            name="visits"
            value={formData.visits}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Most Frequent:</label>
          <input
            type="text"
            name="most_frequent"
            value={formData.most_frequent}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add Customer</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default AddCustomer;
