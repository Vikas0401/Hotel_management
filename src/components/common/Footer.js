import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '30px 20px 20px 20px',
            marginTop: 'auto',
            boxShadow: '0 -4px 15px rgba(0,0,0,0.1)'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '30px',
                alignItems: 'center'
            }}>
                {/* VK Solutions Branding */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                }}>
                    <img 
                        src={`${process.env.PUBLIC_URL}/images/vk-logo.svg`} 
                        alt="VK Solutions" 
                        style={{ 
                            height: '50px', 
                            width: '50px',
                            borderRadius: '50%',
                            border: '3px solid #FFD700',
                            boxShadow: '0 4px 12px rgba(255,215,0,0.4)',
                            background: 'white',
                            padding: '3px'
                        }}
                        onError={(e) => {
                            // Fallback to PNG if SVG doesn't load
                            e.target.src = `${process.env.PUBLIC_URL}/images/vk-logo.png`;
                            e.target.onerror = () => {
                                e.target.style.display = 'none';
                            };
                        }}
                    />
                    <div>
                        <h3 style={{ 
                            margin: '0 0 5px 0', 
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#FFD700',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                        }}>
                            VK Solutions
                        </h3>
                        <p style={{ 
                            margin: '0', 
                            fontSize: '14px', 
                            opacity: '0.95',
                            fontStyle: 'italic',
                            color: '#F0F8FF'
                        }}>
                            Custom Software Development
                        </p>
                    </div>
                </div>

                {/* Contact Information */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        fontSize: '14px'
                    }}>
                        <span style={{ fontSize: '16px' }}>📱</span>
                        <span>+91 9689517133</span>
                    </div>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        fontSize: '14px'
                    }}>
                        <span style={{ fontSize: '16px' }}>📧</span>
                        <span>vikas4kale@gmail.com</span>
                    </div>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        fontSize: '14px'
                    }}>
                        <span style={{ fontSize: '16px' }}>💼</span>
                        <span>Professional IT Solutions & Services</span>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div style={{
                borderTop: '1px solid rgba(255,255,255,0.2)',
                marginTop: '20px',
                paddingTop: '15px',
                textAlign: 'center',
                fontSize: '13px',
                opacity: '0.8'
            }}>
                <p style={{ margin: '0' }}>
                    &copy; {new Date().getFullYear()} Hotel Management System. 
                    Developed by <strong>VK Solutions</strong>. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;