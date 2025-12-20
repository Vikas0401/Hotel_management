/* eslint-disable unicode-bom */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/common/Footer';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [flippedCard, setFlippedCard] = useState(null);

    const tools = [
        {
            title: 'Instant Billing',
            icon: '$',
            description: 'Minimize errors and save time with automated invoices. Generate and print bills in seconds.',
            longDescription: 'Our instant billing tool streamlines your checkout process. It automatically calculates totals, applies taxes, and minimizes the chance of manual errors, allowing you to provide a faster and more professional service to your guests.'
        },
        {
            title: 'Smart Inventory',
            icon: '📦',
            description: 'Track stock in real-time to avoid shortages and reduce waste. Get alerts for low-stock items.',
            longDescription: 'With smart inventory management, you can keep a close eye on your stock levels. This helps you prevent running out of essential items and reduces spoilage, ultimately saving you money and improving operational efficiency.'
        },
        {
            title: 'Staff Management',
            icon: '👥',
            description: 'Track shifts, and team performance. Assign tasks and monitor their completion.',
            longDescription: 'Our staff management tool helps you organize your team effectively. You can create schedules, assign tasks, and track performance to ensure smooth hotel operations and a high level of guest service.'
        },
        {
            title: 'Table & Food Ordering',
            icon: '🍽️',
            description: 'Streamline restaurant orders from table to kitchen. Reduce wait times and improve order accuracy.',
            longDescription: 'This tool simplifies the food ordering process by allowing staff to take orders electronically. Orders are sent directly to the kitchen, which reduces wait times, minimizes errors, and improves communication between the front and back of the house.'
        }
    ];

    const handleCardClick = (index) => {
        if (flippedCard === index) {
            setFlippedCard(null); // Flip back if the same card is clicked
        } else {
            setFlippedCard(index); // Flip to the new card
        }
    };

    return (
        <div className="dashboard-new">
            <div className="main-container">
                <header className="dashboard-header-new">
                    <div className="logo">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="24" rx="4" fill="#3A5BDB"/>
                            <circle cx="8" cy="12" r="2" fill="white"/>
                            <circle cx="16" cy="12" r="2" fill="white"/>
                        </svg>
                        <span>Hotel Management Website</span>
                    </div>
                    <div className="auth-buttons">
                        <Link to="/login" className="btn-login-nav">Log In</Link>
                    </div>
                </header>

                <main className="hero-section">
                    <div className="hero-content-new">
                        <h1>हॉटेल व्यवस्थापन प्रणाली</h1>
                        <p>Manage Billing, inventory, and staff effortlesly. Get started in minutes.</p>
                        <div className="hero-buttons">
                            <Link to="/signup" className="btn-signup">Click Here >></Link>
                            <Link to="/login" className="btn-login-hero">Log In</Link>
                        </div>
                    </div>
                </main>
            </div>

            <section className="powerful-tools">
                <h2>Powerful Tools for Every Aspect of Your Hotel</h2>
                <div className="tools-grid">
                    {tools.map((tool, index) => (
                        <div 
                            className={`tool-card ${flippedCard === index ? 'flipped' : ''}`}
                            key={index}
                            onClick={() => handleCardClick(index)}
                        >
                            <div className="card-inner">
                                <div className="card-front">
                                    <div className={`tool-icon ${tool.title.split(' ')[0].toLowerCase()}-icon`}>{tool.icon}</div>
                                    <h3>{tool.title}</h3>
                                    <p>{tool.description}</p>
                                </div>
                                <div className="card-back">
                                    <h3>{tool.title}</h3>
                                    <p>{tool.longDescription}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="testimonials-section">
                <h2>Trusted by Hoteliers Worldwide</h2>
                <div className="testimonial-categories">
                    <span>Testimonials</span>
                    <span>Our Partners</span>
                </div>
                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <div className="testimonial-author">
                            <img src="https://i.pravatar.cc/50?u=a042581f4e29026704d" alt="Nature Slehtte" />
                            <div>
                                <h4>Nature Slehtte</h4>
                                <div className="stars">★★★★★</div>
                            </div>
                        </div>
                        <p>"Love the way website handles my Hotels data so easily."</p>
                    </div>
                    <div className="testimonial-card">
                        <div className="testimonial-author">
                            <img src="https://i.pravatar.cc/50?u=a042581f4e29026704e" alt="Hornett Rws Eintts" />
                            <div>
                                <h4>Hornett Rws Eintts</h4>
                                <div className="stars">★★★★★</div>
                            </div>
                        </div>
                        <p>"Website themes are best."</p>
                    </div>
                    <div className="testimonial-card">
                        <div className="testimonial-author">
                            <img src="https://i.pravatar.cc/50?u=a042581f4e29026704f" alt="Nure Stmopilte" />
                            <div>
                                <h4>Nure Stmopilte</h4>
                                <div className="stars">★★★★★</div>
                            </div>
                        </div>
                        <p>"I love you to use it daily for my hotel."</p>
                    </div>
                </div>
            </section>
            
            <Footer />
        </div>
    );
};

export default Dashboard;
