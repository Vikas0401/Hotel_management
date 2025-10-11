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
            {/* VK Solutions Branding Header */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '20px',
                borderRadius: '12px 12px 0 0',
                textAlign: 'center',
                marginBottom: '0',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    animation: 'float 6s ease-in-out infinite'
                }}></div>
                
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <img 
                        src="/images/vk-logo.svg" 
                        alt="VK Solutions Logo" 
                        style={{ 
                            height: '80px', 
                            width: '80px',
                            borderRadius: '50%',
                            border: '4px solid white',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                            marginBottom: '15px',
                            background: 'white',
                            padding: '5px'
                        }}
                        onError={(e) => {
                            // Fallback to PNG if SVG doesn't load
                            e.target.src = '/images/vk-logo.png';
                            e.target.onerror = () => {
                                e.target.style.display = 'none';
                            };
                        }}
                    />
                    <h1 style={{ 
                        margin: '0 0 10px 0', 
                        fontSize: '28px', 
                        fontWeight: 'bold',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                    }}>
                        VK Solutions
                    </h1>
                    <p style={{ 
                        margin: '0 0 15px 0', 
                        fontSize: '16px', 
                        opacity: '0.95',
                        fontStyle: 'italic'
                    }}>
                        Professional Software Development & IT Solutions
                    </p>
                    
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: '30px', 
                        flexWrap: 'wrap',
                        marginTop: '15px'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            padding: '8px 15px',
                            borderRadius: '25px',
                            fontSize: '14px'
                        }}>
                            <span style={{ fontSize: '18px' }}>📱</span>
                            <span style={{ fontWeight: '500' }}>+91 9689517133</span>
                        </div>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            padding: '8px 15px',
                            borderRadius: '25px',
                            fontSize: '14px'
                        }}>
                            <span style={{ fontSize: '18px' }}>📧</span>
                            <span style={{ fontWeight: '500' }}>vikas4kale@gmail.com</span>
                        </div>
                    </div>
                </div>
            </div>

            <form className="login-form" onSubmit={handleLogin} style={{ 
                borderRadius: '0 0 12px 12px',
                marginTop: '0',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ marginTop: '20px' }}>Hotel Management System</h2>
                
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