import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Shield, ArrowRight, AlertCircle } from 'lucide-react';
import axios from 'axios';
import './Login.css'; // Reuse auth styles

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'volunteer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/auth/registerAdmin', formData);

      if (response.data.success || response.status === 201) {
        localStorage.setItem('user', JSON.stringify(response.data.admin));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="auth-card glass-panel" style={{ marginTop: '2rem' }}>
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join the CrowdPulse monitoring network.</p>
        </div>
        
        {error && (
          <div className="auth-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="auth-form">
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input 
                type="text" 
                id="name" 
                name="name"
                className="form-control" 
                placeholder="Jane Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input 
                type="email" 
                id="email" 
                name="email"
                className="form-control" 
                placeholder="hello@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input 
                type="password" 
                id="password" 
                name="password"
                className="form-control" 
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="role">Account Type</label>
            <div className="input-wrapper">
              <Shield className="input-icon" size={18} />
              <select 
                id="role" 
                name="role"
                className="form-control"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="volunteer">Volunteer</option>
                <option value="manager">Zone Manager</option>
                <option value="admin">System Admin</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary full-width" style={{marginTop: '1rem'}} disabled={loading}>
            {loading ? 'Creating Account...' : (
              <>Create Account <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;

