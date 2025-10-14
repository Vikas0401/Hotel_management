import React from 'react';
import BillHistory from '../components/Bill/BillHistory';

const BillHistoryPage = () => {
    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            paddingTop: '140px' 
        }}>
            <main style={{ flex: 1 }}>
                <BillHistory />
            </main>
        </div>
    );
};

export default BillHistoryPage;