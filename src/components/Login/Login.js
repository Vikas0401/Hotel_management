import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import './Login.css';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const loginSuccess = login(username, password);
            if (loginSuccess) {
                if (onLogin) {
                    onLogin(); // Update authentication state in parent
                }
                navigate('/home'); // Redirect to home page after successful login
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin} style={{ 
                borderRadius: '12px',
                marginTop: '0',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
                {/* <h2 style={{ marginTop: '20px' }}>Hotel Management System</h2> */}
                
                <div style={{ 
                    background: '#f8f9fa', 
                    padding: '15px', 
                    borderRadius: '6px', 
                    marginBottom: '20px',
                    fontSize: '14px',
                    color: '#495057',
                    textAlign: 'center',
                    border: '1px solid #dee2e6'
                }}>
                    <strong>🏨 Multi-Hotel Management System</strong>
                    <div style={{ marginTop: '8px', fontSize: '13px' }}>
                        Please enter your hotel admin credentials to access the system
                    </div>
                </div>

                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your hotel admin username"
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="form-input"
                        required
                    />
                </div>
                <button type="submit" className="login-button">Login to Hotel System</button>
                
                <div style={{ 
                    marginTop: '20px', 
                    padding: '10px', 
                    fontSize: '12px', 
                    color: '#6c757d', 
                    textAlign: 'center',
                    borderTop: '1px solid #dee2e6'
                }}>
                    <div>🔒 Secure Hotel Management Portal</div>
                    <div style={{ marginTop: '5px' }}>Contact system administrator for access credentials</div>
                </div>
            </form>
        </div>
    );
};

export default Login;