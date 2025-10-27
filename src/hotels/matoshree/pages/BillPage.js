import React from 'react';
import BillPrint from '../components/Bill/BillPrint';
import '../styles/components/Bill.css';

const BillPage = () => {
    return (
        <div className="page-wrapper">
            <BillPrint />
        </div>
    );
};

export default BillPage;