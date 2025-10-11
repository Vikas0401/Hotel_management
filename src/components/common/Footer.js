import React from 'react';

const Footer = () => {
    return (
        <footer>
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} Hotel Website. All rights reserved.</p>
                <p>Contact us: info@hotelwebsite.com</p>
            </div>
        </footer>
    );
};

export default Footer;