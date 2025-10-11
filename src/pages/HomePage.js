import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

// Matoshree Logo Component
const MatoshreeLogo = () => (
    <svg 
        className="matoshree-logo" 
        viewBox="0 0 200 200" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '120px', height: '120px' }}
    >
        {/* Hexagonal background */}
        <polygon 
            points="100,20 170,60 170,140 100,180 30,140 30,60" 
            fill="#C41E3A" 
            stroke="#FFD700" 
            strokeWidth="4"
        />
        
        {/* Inner yellow hexagon */}
        <polygon 
            points="100,35 155,65 155,135 100,165 45,135 45,65" 
            fill="#FFD700"
        />
        
        {/* Text background */}
        <rect x="50" y="70" width="100" height="60" fill="#FFD700" rx="5"/>
        
        {/* Devanagari text हॉटेल (Hotel) */}
        <text x="100" y="90" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#C41E3A">
            हॉटेल
        </text>
        
        {/* Devanagari text मातोश्री (Matoshree) */}
        <text x="100" y="110" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#C41E3A">
            मातोश्री
        </text>
    </svg>
);

// Hotel Icon Component
const HotelIcon = () => (
    <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="30" width="80" height="60" fill="#4A90E2" stroke="#2E5C8A" strokeWidth="2"/>
        <rect x="20" y="20" width="60" height="50" fill="#5BA3F5" stroke="#2E5C8A" strokeWidth="2"/>
        <rect x="30" y="40" width="8" height="12" fill="#FFD700"/>
        <rect x="42" y="40" width="8" height="12" fill="#FFD700"/>
        <rect x="54" y="40" width="8" height="12" fill="#FFD700"/>
        <rect x="66" y="40" width="8" height="12" fill="#FFD700"/>
        <rect x="30" y="55" width="8" height="12" fill="#FFD700"/>
        <rect x="42" y="55" width="8" height="12" fill="#FFD700"/>
        <rect x="54" y="55" width="8" height="12" fill="#FFD700"/>
        <rect x="66" y="55" width="8" height="12" fill="#FFD700"/>
        <path d="M20 20 L50 10 L80 20" stroke="#C41E3A" strokeWidth="3" fill="none"/>
    </svg>
);

const HomePage = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);
        setIsLoading(false);
    }, []);

    // Show loading while checking authentication
    if (isLoading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
    }

    // If user is not logged in, show welcome landing page
    if (!user) {
        return (
            <div style={{ 
                minHeight: '80vh', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '0'
            }}>
                {/* Hero Section */}
                <div style={{ 
                    textAlign: 'center', 
                    padding: '60px 20px', 
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <HotelIcon />
                    <h1 style={{ 
                        fontSize: '3rem', 
                        margin: '20px 0', 
                        fontWeight: 'bold',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                    }}>
                        Hotel Management System
                    </h1>
                    <p style={{ 
                        fontSize: '1.3rem', 
                        marginBottom: '40px', 
                        maxWidth: '600px', 
                        margin: '0 auto 40px',
                        opacity: '0.9'
                    }}>
                        Complete digital solution for modern hotel operations with billing, menu management, and customer service
                    </p>
                    <button 
                        onClick={() => navigate('/login')}
                        style={{
                            background: '#C41E3A',
                            color: 'white',
                            border: 'none',
                            padding: '15px 40px',
                            fontSize: '1.2rem',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            boxShadow: '0 8px 25px rgba(196, 30, 58, 0.3)',
                            transition: 'all 0.3s ease',
                            fontWeight: 'bold'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 12px 35px rgba(196, 30, 58, 0.4)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 8px 25px rgba(196, 30, 58, 0.3)';
                        }}
                    >
                        Get Started →
                    </button>
                </div>

                {/* Features Section */}
                <div style={{ 
                    padding: '60px 20px', 
                    background: 'white', 
                    color: '#333'
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <h2 style={{ 
                            textAlign: 'center', 
                            fontSize: '2.5rem', 
                            marginBottom: '50px',
                            color: '#2c3e50'
                        }}>
                            Powerful Features for Your Hotel
                        </h2>
                        
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                            gap: '30px',
                            marginBottom: '50px'
                        }}>
                            {[
                                {
                                    icon: '🧾',
                                    title: 'Smart Billing System',
                                    description: 'Generate professional bills with payment tracking (जमा/बाकी), PDF export, and automatic calculations.'
                                },
                                {
                                    icon: '📱',
                                    title: 'Mobile-First Design',
                                    description: 'Optimized for tablets and mobile devices. Access your hotel management system anywhere, anytime.'
                                },
                                {
                                    icon: '🍽️',
                                    title: 'Menu Management',
                                    description: 'Dynamic menu system with easy item addition, pricing updates, and category organization.'
                                },
                                {
                                    icon: '📊',
                                    title: 'Bill History & Reports',
                                    description: 'Complete transaction history with search, filter, and export capabilities for business insights.'
                                },
                                {
                                    icon: '🔐',
                                    title: 'Secure Authentication',
                                    description: 'Role-based access control ensuring data security and user privacy protection.'
                                },
                                {
                                    icon: '🎨',
                                    title: 'Multi-language Support',
                                    description: 'Built with Marathi language support for local businesses and traditional hotel operations.'
                                }
                            ].map((feature, index) => (
                                <div key={index} style={{
                                    background: '#f8f9fa',
                                    padding: '30px',
                                    borderRadius: '15px',
                                    textAlign: 'center',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.3s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                                >
                                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>
                                        {feature.icon}
                                    </div>
                                    <h3 style={{ 
                                        color: '#2c3e50', 
                                        marginBottom: '15px',
                                        fontSize: '1.3rem'
                                    }}>
                                        {feature.title}
                                    </h3>
                                    <p style={{ 
                                        color: '#666', 
                                        lineHeight: '1.6',
                                        fontSize: '1rem'
                                    }}>
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Technology Section */}
                <div style={{ 
                    padding: '60px 20px', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    textAlign: 'center'
                }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h2 style={{ 
                            fontSize: '2.5rem', 
                            marginBottom: '30px',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                        }}>
                            Built with Modern Technology
                        </h2>
                        <p style={{ 
                            fontSize: '1.2rem', 
                            marginBottom: '40px', 
                            opacity: '0.9',
                            lineHeight: '1.6'
                        }}>
                            Our hotel management system is built using cutting-edge web technologies 
                            ensuring fast performance, reliability, and seamless user experience.
                        </p>
                        
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            flexWrap: 'wrap', 
                            gap: '20px',
                            marginBottom: '40px'
                        }}>
                            {['React.js', 'JavaScript', 'PDF Generation', 'Responsive Design', 'localStorage', 'Modern UI/UX'].map((tech, index) => (
                                <span key={index} style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    padding: '10px 20px',
                                    borderRadius: '25px',
                                    fontSize: '1rem',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.3)'
                                }}>
                                    {tech}
                                </span>
                            ))}
                        </div>
                        
                        <button 
                            onClick={() => navigate('/login')}
                            style={{
                                background: 'white',
                                color: '#667eea',
                                border: 'none',
                                padding: '15px 40px',
                                fontSize: '1.2rem',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                                fontWeight: 'bold',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 12px 35px rgba(0,0,0,0.3)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                            }}
                        >
                            Start Managing Your Hotel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // For logged-in users, show the original hotel-specific content
    const getHotelDescription = () => {
        if (user?.hotelId === 'matoshree') {
            return {
                title: 'हॉटेल मातोश्रीमध्ये आपले स्वागत आहे',
                description: 'पारंपारिक आणि स्वागतार्ह वातावरणात अस्सल महाराष्ट्रीयन शाकाहारी पाककृतीचा अनुभव घ्या. आमच्या विशेष थाळीपासून ते पारंपारिक नाश्त्यापर्यंत जसे की वडापाव आणि मिसळपाव, आम्ही शुद्ध शाकाहारी स्वाद देतो जे महाराष्ट्राचे खरे सार दर्शवतात.',
                specialties: [
                    {
                        title: 'पारंपारिक शाकाहारी',
                        color: '#C41E3A',
                        description: 'पारंपारिक पद्धतीने बनवलेल्या शुद्ध शाकाहारी महाराष्ट्रीयन पाककृती'
                    },
                    {
                        title: 'ताजे आणि निरोगी',
                        color: '#28a745',
                        description: 'निरोगी आणि पौष्टिक जेवणासाठी स्थानिक स्तरावर मिळणारे ताजे घटक'
                    },
                    {
                        title: 'घरगुती वातावरण',
                        color: '#FF8C00',
                        description: 'पारंपारिक घरगुती वातावरण जे तुम्हाला कुटुंबासारखे वाटते'
                    }
                ],
                menuNote: 'पारंपारिक महाराष्ट्रीयन थाळी, नाश्ता आणि मिठाई यांचा समावेश असलेला आमचा व्यापक शाकाहारी मेनू पहा. थालीपीठपासून पुरणपोळीपर्यंत, आमच्याकडे प्रत्येकासाठी अस्सल चव आहे!'
            };
        } else {
            return {
                title: 'महाराष्ट्र हॉटेलमध्ये आपले स्वागत आहे',
                description: 'उबदार आणि स्वागतार्ह वातावरणात अस्सल महाराष्ट्रीयन पाककृतीचा अनुभव घ्या. पारंपारिक वडापावपासून स्वादिष्ट बिर्यानीपर्यंत, आम्ही महाराष्ट्राची सर्वोत्तम चव देतो.',
                specialties: [
                    {
                        title: 'अस्सल चव',
                        color: '#e74c3c',
                        description: 'पिढ्यानपिढ्या चालत आलेल्या पारंपारिक महाराष्ट्रीयन पाककृती'
                    },
                    {
                        title: 'ताजे घटक',
                        color: '#28a745',
                        description: 'सर्वोत्तम चव आणि गुणवत्तेसाठी स्थानिकरित्या मिळणारे ताजे घटक'
                    },
                    {
                        title: 'जलद सेवा',
                        color: '#007bff',
                        description: 'तुमचा जेवणाचा अनुभव आनंददायक करण्यासाठी जलद आणि कार्यक्षम सेवा'
                    }
                ],
                menuNote: '५०+ पेक्षा जास्त अस्सल महाराष्ट्रीयन पदार्थांचा समावेश असलेला आमचा व्यापक मेनू पहा. रस्त्यावरील लोकप्रिय खाद्यपदार्थांपासून पारंपारिक थाळीपर्यंत, आमच्याकडे प्रत्येकासाठी काहीतरी आहे!'
            };
        }
    };

    const hotelInfo = getHotelDescription();

    return (
        <div style={{ padding: '40px 20px', textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Show Matoshree logo only for Matoshree hotel */}
            {user?.hotelId === 'matoshree' && (
                <div style={{ marginBottom: '30px' }}>
                    <MatoshreeLogo />
                </div>
            )}
            
                        <h1 style={{ 
                textAlign: 'center', 
                color: user?.hotelId === 'matoshree' ? '#C41E3A' : '#2c3e50', 
                fontSize: '2.5rem', 
                marginBottom: '30px' 
            }} className={user?.hotelId === 'matoshree' ? 'marathi-title' : ''}>
                {hotelInfo.title}
            </h1>
            
            <div className={user?.hotelId === 'matoshree' ? 'card' : ''} style={{ 
                background: user?.hotelId === 'matoshree' ? 'inherit' : '#f8f9fa', 
                padding: '30px', 
                borderRadius: '8px', 
                boxShadow: user?.hotelId === 'matoshree' ? 'inherit' : '0 2px 10px rgba(0,0,0,0.1)',
                marginBottom: '30px'
            }}>
                <p style={{ fontSize: '1.2rem', color: '#555', lineHeight: '1.6' }} className={user?.hotelId === 'matoshree' ? 'marathi-body' : ''}>
                    {hotelInfo.description}
                </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '40px' }}>
                {hotelInfo.specialties.map((specialty, index) => (
                    <div key={index} className={user?.hotelId === 'matoshree' ? 'card' : ''} style={{ 
                        background: 'white', 
                        padding: '20px', 
                        borderRadius: '8px', 
                        boxShadow: user?.hotelId === 'matoshree' ? 'inherit' : '0 2px 10px rgba(0,0,0,0.1)',
                        border: user?.hotelId === 'matoshree' ? 'inherit' : `2px solid ${specialty.color}`
                    }}>
                        <h3 style={{ color: specialty.color, marginBottom: '15px' }} className={user?.hotelId === 'matoshree' ? 'marathi-header' : ''}>{specialty.title}</h3>
                        <p style={{ color: '#666' }} className={user?.hotelId === 'matoshree' ? 'marathi-body' : ''}>{specialty.description}</p>
                    </div>
                ))}
            </div>
            
            <div className={user?.hotelId === 'matoshree' ? 'card' : ''} style={{ 
                marginTop: '40px', 
                padding: '20px', 
                background: user?.hotelId === 'matoshree' ? 'inherit' : '#e8f5e8', 
                borderRadius: '8px' 
            }}>
                <h3 style={{ color: '#28a745', marginBottom: '15px' }} className={user?.hotelId === 'matoshree' ? 'marathi-header' : ''}>आमचा मेनू पहा</h3>
                <p style={{ color: '#555' }} className={user?.hotelId === 'matoshree' ? 'marathi-body' : ''}>
                    {hotelInfo.menuNote}
                </p>
            </div>
        </div>
    );
};

export default HomePage;