/* eslint-disable unicode-bom */
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/home');
        }
    }, [navigate]);

    return (
        <div className="dashboard">
            <section className="main-layout">
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
                <div className="features-side">
                    <h2 className="features-title">🌟 मुख्य वैशिष्ट्ये</h2>
                    <div className="features-grid-compact">
                        <div className="feature-card-compact bill-card">
                            <div className="card-icon-compact">🧾</div>
                            <h3>बिल व्यवस्थापन</h3>
                            <p>जलद आणि अचूक बिलिंग</p>
                        </div>
                        <div className="feature-card-compact menu-card">
                            <div className="card-icon-compact">🍽️</div>
                            <h3>टेबल ऑर्डरिंग</h3>
                            <p>मल्टिपल टेबल व्यवस्थापन</p>
                        </div>
                        <div className="feature-card-compact parcel-card">
                            <div className="card-icon-compact">📦</div>
                            <h3>पार्सल ऑर्डर</h3>
                            <p>टेकअवे आणि डिलिव्हरी</p>
                        </div>
                        <div className="feature-card-compact history-card">
                            <div className="card-icon-compact">📊</div>
                            <h3>इतिहास आणि अहवाल</h3>
                            <p>विस्तृत बिझनेस अॅनालिटिक्स</p>
                        </div>
                        <div className="feature-card-compact user-card">
                            <div className="card-icon-compact">👥</div>
                            <h3>वापरकर्ता व्यवस्थापन</h3>
                            <p>सुरक्षित लॉगिन सिस्टम</p>
                        </div>
                        <div className="feature-card-compact mobile-card">
                            <div className="card-icon-compact">📱</div>
                            <h3>मोबाईल फ्रेंडली</h3>
                            <p>रेस्पॉन्सिव्ह डिझाईन</p>
                        </div>
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