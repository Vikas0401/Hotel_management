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
                    
                    {/* Demo Credentials Section */}
                    <div style={{ 
                        marginTop: '30px', 
                        padding: '20px', 
                        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                        borderRadius: '12px',
                        border: '2px solid #28a745',
                        boxShadow: '0 4px 15px rgba(40, 167, 69, 0.2)'
                    }}>
                        <h3 style={{ 
                            color: '#28a745', 
                            textAlign: 'center', 
                            marginBottom: '15px',
                            fontSize: '1.2rem',
                            fontWeight: 'bold'
                        }}>🔐 डेमो लॉगिन माहिती</h3>
                        
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                            gap: '15px' 
                        }}>
                            <div style={{ 
                                background: 'white', 
                                padding: '15px', 
                                borderRadius: '8px',
                                border: '1px solid #C41E3A',
                                boxShadow: '0 2px 8px rgba(196, 30, 58, 0.1)'
                            }}>
                                <h4 style={{ color: '#C41E3A', margin: '0 0 10px 0' }}>🏨 हॉटेल मातोश्री</h4>
                                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Username:</strong> matoshree_admin</p>
                                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Password:</strong> matoshree@2025</p>
                            </div>
                            
                            <div style={{ 
                                background: 'white', 
                                padding: '15px', 
                                borderRadius: '8px',
                                border: '1px solid #0D47A1',
                                boxShadow: '0 2px 8px rgba(13, 71, 161, 0.1)'
                            }}>
                                <h4 style={{ color: '#0D47A1', margin: '0 0 10px 0' }}>🏨 हॉटेल जगदंबा</h4>
                                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Username:</strong> jagdamba_hotel_admin</p>
                                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Password:</strong> jagdamba#2025!secure</p>
                            </div>
                            
                            <div style={{ 
                                background: 'white', 
                                padding: '15px', 
                                borderRadius: '8px',
                                border: '1px solid #2E7D32',
                                boxShadow: '0 2px 8px rgba(46, 125, 50, 0.1)'
                            }}>
                                <h4 style={{ color: '#2E7D32', margin: '0 0 10px 0' }}>🏨 हॉटेल श्री हरी</h4>
                                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Username:</strong> shreehari_admin</p>
                                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Password:</strong> shreehari@2025#secure</p>
                            </div>
                        </div>
                        
                        <p style={{ 
                            textAlign: 'center', 
                            marginTop: '15px', 
                            fontSize: '12px', 
                            color: '#6c757d',
                            fontStyle: 'italic'
                        }}>
                            👆 वरील क्रेडेंशियल्स वापरून तुम्ही संबंधित हॉटेलमध्ये लॉगिन करू शकता
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
