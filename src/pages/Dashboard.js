import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // If user is already logged in, redirect to home page
        if (isAuthenticated()) {
            navigate('/home');
        }
    }, [navigate]);

    return (
        <div className="dashboard">
            {/* Main Content - Two Column Layout */}
            <section className="main-layout">
                {/* Left Side - Hero Content */}
                <div className="hero-side">
                    <div className="hero-content">
                        <div className="hero-icon">🏨</div>
                        <h1 className="hero-title">हॉटेल व्यवस्थापन प्रणाली</h1>
                        <p className="hero-subtitle">आधुनिक तंत्रज्ञानासह हॉटेल व्यवसायाचे संपूर्ण व्यवस्थापन</p>
                        <Link to="/login" className="cta-button">
                            🔐 लॉग इन करा
                        </Link>
                    </div>
                </div>

                {/* Right Side - Features */}
                <div className="features-side">
                    <h2 className="features-title">🌟 मुख्य वैशिष्ट्ये</h2>
                    <div className="features-grid-compact">
                        
                        {/* Bill Management Card */}
                        <div className="feature-card-compact bill-card">
                            <div className="card-icon-compact">🧾</div>
                            <h3>बिल व्यवस्थापन</h3>
                            <p>जलद आणि अचूक बिलिंग</p>
                        </div>

                        {/* Menu Management Card */}
                        <div className="feature-card-compact menu-card">
                            <div className="card-icon-compact">📋</div>
                            <h3>मेनू व्यवस्थापन</h3>
                            <p>संपूर्ण फूड मेनू कंट्रोल</p>
                        </div>

                        {/* History & Reports Card */}
                        <div className="feature-card-compact history-card">
                            <div className="card-icon-compact">📊</div>
                            <h3>इतिहास आणि अहवाल</h3>
                            <p>विस्तृत बिझनेस अॅनालिटिक्स</p>
                        </div>

                        {/* User Management Card */}
                        <div className="feature-card-compact user-card">
                            <div className="card-icon-compact">👥</div>
                            <h3>वापरकर्ता व्यवस्थापन</h3>
                            <p>सुरक्षित लॉगिन सिस्टम</p>
                        </div>

                        {/* Mobile Friendly Card */}
                        <div className="feature-card-compact mobile-card">
                            <div className="card-icon-compact">📱</div>
                            <h3>मोबाईल फ्रेंडली</h3>
                            <p>रेस्पॉन्सिव्ह डिझाईन</p>
                        </div>

                        {/* PDF Export Card */}
                        <div className="feature-card-compact pdf-card">
                            <div className="card-icon-compact">📄</div>
                            <h3>PDF निर्यात</h3>
                            <p>व्यावसायिक डॉक्यूमेंट्स</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;