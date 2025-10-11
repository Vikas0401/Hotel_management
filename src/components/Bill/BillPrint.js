import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../services/authService';
import { saveBillToHistory } from '../../services/billHistoryService';

const BillPrint = () => {
    const [foodItems, setFoodItems] = useState([]);
    const [billNumber] = useState(() => 'B' + Date.now().toString().slice(-6));
    const [currentDate] = useState(() => new Date().toLocaleDateString());
    const [currentTime] = useState(() => new Date().toLocaleTimeString());
    const [user, setUser] = useState(null);
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        tableNumber: '',
        phoneNumber: ''
    });

    useEffect(() => {
        // Load food items from localStorage
        const savedFoods = localStorage.getItem('selectedFoods');
        if (savedFoods) {
            setFoodItems(JSON.parse(savedFoods));
        }

        // Load customer info from localStorage
        const savedCustomerInfo = localStorage.getItem('customerInfo');
        if (savedCustomerInfo) {
            setCustomerInfo(JSON.parse(savedCustomerInfo));
        }

        setUser(getCurrentUser());
    }, []);

    const calculateSubtotal = () => {
        return foodItems.reduce((total, item) => total + (item.rate * item.quantity), 0);
    };

    const calculateTax = (subtotal) => {
        return subtotal * 0.18; // 18% GST
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const tax = calculateTax(subtotal);
        return subtotal + tax;
    };

    const handlePrint = () => {
        window.print();
    };

    const handleClearBill = () => {
        if (window.confirm('तुम्हाला खात्री आहे की तुम्ही बिल क्लियर करू इच्छिता?')) {
            localStorage.removeItem('selectedFoods');
            localStorage.removeItem('customerInfo');
            setFoodItems([]);
            setCustomerInfo({ name: '', tableNumber: '', phoneNumber: '' });
        }
    };

    const handleSaveBill = () => {
        if (foodItems.length === 0) {
            alert('बिल सेव्ह करण्यासाठी आयटम जोडा!');
            return;
        }

        const billData = {
            billNumber,
            date: currentDate,
            time: currentTime,
            customerInfo,
            items: foodItems,
            subtotal,
            tax,
            total
        };

        const success = saveBillToHistory(billData);
        
        if (success) {
            alert('बिल यशस्वीरित्या सेव्ह झाले!');
        } else {
            alert('बिल सेव्ह करताना काही त्रुटी झाली. कृपया पुन्हा प्रयत्न करा.');
        }
    };

    const handleCustomerInfoChange = (e) => {
        const { name, value } = e.target;
        const updatedInfo = {
            ...customerInfo,
            [name]: value
        };
        setCustomerInfo(updatedInfo);
        localStorage.setItem('customerInfo', JSON.stringify(updatedInfo));
    };

    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const total = calculateTotal();

    const getHotelAddress = () => {
        if (user?.hotelId === 'matoshree') {
            return {
                address: user?.address || "वांबोरी, राहुरी, जिल्हा - अहिल्यानगर, महाराष्ट्र - ४१३७०४",
                phone: "+91 9876543210",
                email: "info@hotelmatoshree.com",
                gstin: "27ABCDE1234F1Z5"
            };
        } else {
            return {
                address: user?.address || "महाराष्ट्र, भारत",
                phone: "+91 9876543210",
                email: "info@maharashtrahotel.com",
                gstin: "27ABCDE1234F1Z5"
            };
        }
    };

    const hotelInfo = getHotelAddress();

    return (
        <div className="bill-print" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <div className="bill-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h1 
                    className={user?.hotelId === 'matoshree' ? 'hotel-matoshree-name' : ''}
                    style={{
                        color: user?.hotelId === 'matoshree' ? '#C41E3A' : '#2c3e50',
                        textShadow: 'none',
                        background: 'none',
                        WebkitBackgroundClip: 'unset',
                        backgroundClip: 'unset',
                        WebkitTextFillColor: 'unset',
                        fontSize: '2em',
                        margin: '0 0 10px 0',
                        lineHeight: '1.2'
                    }}
                >
                    {user?.hotelName || 'Hotel'}
                </h1>
                <div className="hotel-details" style={{ fontSize: '14px', lineHeight: '1.4' }}>
                    <p style={{ margin: '5px 0' }}>{hotelInfo.address}</p>
                    <p style={{ margin: '5px 0' }}>Phone: {hotelInfo.phone} | Email: {hotelInfo.email}</p>
                    <p style={{ margin: '5px 0' }}>GSTIN: {hotelInfo.gstin}</p>
                </div>
            </div>

            <div className="bill-info" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '20px',
                padding: '10px 0',
                borderBottom: '1px solid #ddd',
                fontSize: '14px'
            }}>
                <div>
                    <strong>Bill No: </strong>
                    {billNumber}
                </div>
                <div>
                    <strong>Date: </strong>
                    {currentDate}
                </div>
                <div>
                    <strong>Time: </strong>
                    {currentTime}
                </div>
            </div>

            {/* Customer Information */}
            <div className="customer-info" style={{ 
                marginBottom: '20px', 
                padding: '15px', 
                background: '#f8f9fa', 
                borderRadius: '6px',
                border: '1px solid #ddd'
            }}>
                <h3 style={{ 
                    color: user?.hotelId === 'matoshree' ? '#C41E3A' : '#2c3e50', 
                    marginBottom: '15px',
                    fontSize: '18px'
                }} className={user?.hotelId === 'matoshree' ? 'marathi-header' : ''}>
                    ग्राहक माहिती
                </h3>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '15px' 
                }}>
                    <input
                        type="text"
                        name="name"
                        placeholder="ग्राहकाचे नाव"
                        value={customerInfo.name}
                        onChange={handleCustomerInfoChange}
                        style={{
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}
                        className={user?.hotelId === 'matoshree' ? 'marathi-body' : ''}
                    />
                    <input
                        type="text"
                        name="tableNumber"
                        placeholder="टेबल नंबर"
                        value={customerInfo.tableNumber}
                        onChange={handleCustomerInfoChange}
                        style={{
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}
                        className={user?.hotelId === 'matoshree' ? 'marathi-body' : ''}
                    />
                    <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="मोबाइल नंबर"
                        value={customerInfo.phoneNumber}
                        onChange={handleCustomerInfoChange}
                        style={{
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}
                        className={user?.hotelId === 'matoshree' ? 'marathi-body' : ''}
                    />
                </div>
            </div>

            {foodItems.length > 0 ? (
                <>
                    {/* Customer Info for Print */}
                    {(customerInfo.name || customerInfo.tableNumber || customerInfo.phoneNumber) && (
                        <div className="print-customer-info" style={{ 
                            marginBottom: '15px', 
                            padding: '10px 0',
                            borderBottom: '1px solid #ddd',
                            fontSize: '16px',
                            fontWeight: '500'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
                                {customerInfo.name && (
                                    <div style={{ fontSize: '16px' }} className={user?.hotelId === 'matoshree' ? 'marathi-body' : ''}><strong>ग्राहक:</strong> {customerInfo.name}</div>
                                )}
                                {customerInfo.tableNumber && (
                                    <div style={{ fontSize: '16px' }} className={user?.hotelId === 'matoshree' ? 'marathi-body' : ''}><strong>टेबल:</strong> {customerInfo.tableNumber}</div>
                                )}
                                {customerInfo.phoneNumber && (
                                    <div style={{ fontSize: '16px' }} className={user?.hotelId === 'matoshree' ? 'marathi-body' : ''}><strong>मोबाइल:</strong> {customerInfo.phoneNumber}</div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    <table className="bill-table">
                        <thead>
                            <tr>
                                <th>कोड</th>
                                <th>आयटम</th>
                                <th>दर</th>
                                <th>संख्या</th>
                                <th>रक्कम</th>
                            </tr>
                        </thead>
                        <tbody>
                            {foodItems.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.code}</td>
                                    <td>{item.name}</td>
                                    <td>₹{item.rate}</td>
                                    <td>{item.quantity}</td>
                                    <td>₹{(item.rate * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="bill-summary">
                        <div className="summary-row">
                            <span>उपजोड:</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>जीएसटी (18%):</span>
                            <span>₹{tax.toFixed(2)}</span>
                        </div>
                        <div className="total-row">
                            <span>एकूण रक्कम:</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
                        <p>{user?.hotelName} ला भेट दिल्याबद्दल धन्यवाद!</p>
                        <p>पुन्हा लवकर भेट द्या!</p>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={handleSaveBill} className="save-button" style={{
                            backgroundColor: user?.hotelId === 'matoshree' ? '#C41E3A' : '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}>
                            बिल सेव्ह करा
                        </button>
                        <button onClick={handlePrint} className="print-button">
                            बिल प्रिंट करा
                        </button>
                        <button onClick={handleClearBill} className="clear-button">
                            बिल क्लियर करा
                        </button>
                    </div>
                </>
            ) : (
                <div className="no-items" style={{ textAlign: 'center', padding: '40px', fontSize: '16px' }}>
                    <p>प्रिंट करण्यासाठी कोणतेही आयटम नाहीत. कृपया मेनूमधून आयटम जोडा.</p>
                </div>
            )}
        </div>
    );
};

export default BillPrint;