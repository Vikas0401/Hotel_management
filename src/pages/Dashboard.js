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
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-icon">🏨</div>
                    <h1 className="hero-title">हॉटेल व्यवस्थापन प्रणाली</h1>
                    <p className="hero-subtitle">आधुनिक तंत्रज्ञानासह हॉटेल व्यवसायाचे संपूर्ण व्यवस्थापन</p>
                    <Link to="/login" className="cta-button">
                        🔐 लॉग इन करा
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">🌟 मुख्य वैशिष्ट्ये</h2>
                    <div className="features-grid">
                        
                        {/* Bill Management Card */}
                        <div className="feature-card bill-card">
                            <div className="card-icon">🧾</div>
                            <h3>बिल व्यवस्थापन</h3>
                            <p>जलद आणि अचूक बिलिंग सिस्टम</p>
                            <ul className="feature-list">
                                <li>✅ स्वयंचलित बिल गणना</li>
                                <li>✅ जमा-बाकी ट्रॅकिंग</li>
                                <li>✅ PDF निर्यात</li>
                            </ul>
                        </div>

                        {/* Menu Management Card */}
                        <div className="feature-card menu-card">
                            <div className="card-icon">📋</div>
                            <h3>मेनू व्यवस्थापन</h3>
                            <p>संपूर्ण फूड मेनू कंट्रोल</p>
                            <ul className="feature-list">
                                <li>✅ नवीन पदार्थ जोडा</li>
                                <li>✅ किंमत अपडेट करा</li>
                                <li>✅ श्रेणी व्यवस्थापन</li>
                            </ul>
                        </div>

                        {/* History & Reports Card */}
                        <div className="feature-card history-card">
                            <div className="card-icon">📊</div>
                            <h3>इतिहास आणि अहवाल</h3>
                            <p>विस्तृत बिझनेस अॅनालिटिक्स</p>
                            <ul className="feature-list">
                                <li>✅ बिल इतिहास</li>
                                <li>✅ दैनिक/मासिक अहवाल</li>
                                <li>✅ पेमेंट ट्रॅकिंग</li>
                            </ul>
                        </div>

                        {/* User Management Card */}
                        <div className="feature-card user-card">
                            <div className="card-icon">👥</div>
                            <h3>वापरकर्ता व्यवस्थापन</h3>
                            <p>सुरक्षित लॉगिन सिस्टम</p>
                            <ul className="feature-list">
                                <li>✅ सुरक्षित प्रवेश</li>
                                <li>✅ हॉटेल-आधारित अॅक्सेस</li>
                                <li>✅ सेशन व्यवस्थापन</li>
                            </ul>
                        </div>

                        {/* Mobile Friendly Card */}
                        <div className="feature-card mobile-card">
                            <div className="card-icon">📱</div>
                            <h3>मोबाईल फ्रेंडली</h3>
                            <p>कोणत्याही डिव्हाइसवर वापरा</p>
                            <ul className="feature-list">
                                <li>✅ रेस्पॉन्सिव्ह डिझाईन</li>
                                <li>✅ टच-फ्रेंडली इंटरफेस</li>
                                <li>✅ ऑफलाईन सपोर्ट</li>
                            </ul>
                        </div>

                        {/* PDF Export Card */}
                        <div className="feature-card pdf-card">
                            <div className="card-icon">📄</div>
                            <h3>PDF निर्यात</h3>
                            <p>व्यावसायिक डॉक्यूमेंट्स</p>
                            <ul className="feature-list">
                                <li>✅ बिल PDF डाउनलोड</li>
                                <li>✅ रिपोर्ट निर्यात</li>
                                <li>✅ प्रिंट-रेडी फॉर्मेट</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="benefits-section">
                <div className="container">
                    <h2 className="section-title">🎯 फायदे</h2>
                    <div className="benefits-grid">
                        <div className="benefit-item">
                            <div className="benefit-icon">⚡</div>
                            <h4>जलद कामकाज</h4>
                            <p>वेळ वाचवा आणि कार्यक्षमता वाढवा</p>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-icon">💰</div>
                            <h4>अचूक हिशेब</h4>
                            <p>चुकांमुक्त बिलिंग आणि गणना</p>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-icon">📈</div>
                            <h4>बिझनेस ग्रोथ</h4>
                            <p>डेटा-ड्रिव्हन निर्णय घ्या</p>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-icon">🔒</div>
                            <h4>सुरक्षित</h4>
                            <p>आपला डेटा संपूर्णपणे सुरक्षित</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="stats-section">
                <div className="container">
                    <h2 className="section-title">📊 आकडेवारी</h2>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <div className="stat-number">50+</div>
                            <div className="stat-label">मेनू आयटम्स</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">99.9%</div>
                            <div className="stat-label">अपटाईम</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">100%</div>
                            <div className="stat-label">सुरक्षित</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">24/7</div>
                            <div className="stat-label">उपलब्ध</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>आजच सुरुवात करा! 🚀</h2>
                        <p>आपल्या हॉटेल बिझनेसला डिजिटल बनवा</p>
                        <div className="cta-buttons">
                            <Link to="/login" className="btn-primary">
                                🔐 लॉग इन करा
                            </Link>
                            <a href="#features" className="btn-secondary">
                                📖 अधिक जाणून घ्या
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;