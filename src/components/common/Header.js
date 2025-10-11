import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../../services/authService';
import './Header.css';

const Header = ({ isAuthenticated, onLogout }) => {
    const [user, setUser] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (isAuthenticated) {
            setUser(getCurrentUser());
        } else {
            setUser(null);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        }
    };

    return (
        <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
            {/* Signature Line */}
            {isAuthenticated && (
                <div style={{ 
                    background: user?.hotelId === 'matoshree' ? '#C41E3A' : '#e74c3c',
                    color: '#FFD700',
                    textAlign: 'center',
                    padding: '8px 20px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    letterSpacing: '1px',
                    borderBottom: '2px solid #FFD700'
                }}>
                    "चविने खानार त्याला हरिभाऊ देणार"
                </div>
            )}
            <div className="header-content">
                <Link to="/" className={`logo ${user?.hotelId === 'matoshree' ? 'hotel-matoshree-name' : ''}`}>
                    {user?.hotelName || 'Hotel Management System'}
                </Link>
                <nav>
                    <ul className="nav-menu">
                        {/* Only show home link if not on login page and authenticated */}
                        {isAuthenticated && location.pathname !== '/' && (
                            <li><Link to="/">मुख्यपृष्ठ</Link></li>
                        )}
                        {isAuthenticated && (
                            <>
                                <li><Link to="/menu">मेनू</Link></li>
                                <li><Link to="/bill">बिल</Link></li>
                                <li><Link to="/bill-history">बिल इतिहास</Link></li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '14px', opacity: '0.8' }}>
                                        स्वागत आहे, {user?.hotelName}
                                    </span>
                                    <button 
                                        onClick={handleLogout}
                                        style={{
                                            background: 'none',
                                            border: '1px solid white',
                                            color: 'white',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            padding: '5px 10px',
                                            borderRadius: '4px',
                                            transition: 'all 0.3s'
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.backgroundColor = 'white';
                                            e.target.style.color = '#2c3e50';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.backgroundColor = 'transparent';
                                            e.target.style.color = 'white';
                                        }}
                                    >
                                        लॉगआउट
                                    </button>
                                </li>
                            </>
                        )}
                        {!isAuthenticated && (
                            <li><Link to="/login">Login</Link></li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;