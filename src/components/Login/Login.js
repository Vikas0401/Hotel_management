import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import './Login.css';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                    <div className="password-input-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="form-input password-input"
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={togglePasswordVisibility}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.12 14.12C13.8454 14.4148 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9770 15.0744C11.5732 15.0815 11.1729 15.0074 10.7996 14.857C10.4263 14.7066 10.0884 14.4834 9.80781 14.2028C9.52716 13.9222 9.30402 13.5843 9.15362 13.211C9.00322 12.8377 8.92912 12.4374 8.93622 12.0336C8.94332 11.6297 9.03148 11.2324 9.19544 10.8644C9.35939 10.4965 9.59581 10.1652 9.89062 9.89062L14.12 14.12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M9.89062 9.89062C10.6406 9.1406 11.8906 8.5 12 8.5C14.5 8.5 16.5 10.5 16.5 12C16.5 12.1094 16.3594 13.3594 15.6094 14.1094" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M17.94 5.06L4.94 18.06" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M4.5 12C6.5 8.5 9.5 6.5 12 6.5C12.3594 6.5 12.7031 6.54688 13.0312 6.625" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M19.5 12C18.5781 13.5781 17.3281 14.8281 15.875 15.7188" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                        </button>
                    </div>
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