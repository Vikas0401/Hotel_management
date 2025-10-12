import React from 'react';
import BillPrint from '../components/Bill/BillPrint';
import '../styles/components/Bill.css';

const BillPage = () => {
    return (
        <div style={{ paddingTop: '140px' }}>
            <BillPrint />
        </div>
    );
};

export default BillPage;