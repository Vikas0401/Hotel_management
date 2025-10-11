import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/authService';

// Matoshree Logo Component
const MatoshreeLogo = () => (
    <svg 
        className="matoshree-logo" 
        viewBox="0 0 200 200" 
        xmlns="http://www.w3.org/2000/svg"
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

const HomePage = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        setUser(getCurrentUser());
    }, []);

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