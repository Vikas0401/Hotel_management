import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import BillHistory from '../components/Bill/BillHistory';

const BillHistoryPage = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1, paddingTop: '80px' }}>
                <BillHistory />
            </main>
            <Footer />
        </div>
    );
};

export default BillHistoryPage;