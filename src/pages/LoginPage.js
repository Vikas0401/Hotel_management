import React from 'react';
import Login from '../components/Login/Login';
import ThemeSelector from '../shared/components/ThemeSelector';

const LoginPage = ({ onLogin }) => {
    return (
        <div style={{
            maxWidth: '1080px',
            margin: '0 auto',
            padding: '2rem 1rem'
        }}>
            {/* Global Theme Selector visible to everyone */}
            <ThemeSelector />
            <Login onLogin={onLogin} />
        </div>
    );
};

export default LoginPage;