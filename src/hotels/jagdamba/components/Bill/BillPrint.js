import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../services/authService';
import { saveBillToHistory } from '../../services/billHistoryService';
import { clearTableOrder } from '../../services/tableService';

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
    const [paymentInfo, setPaymentInfo] = useState({
        jama: 0, // received amount
        baki: 0  // remaining balance
    });
    const [includeGST, setIncludeGST] = useState(false); // GST checkbox state - unchecked by default

    useEffect(() => {
        // Set user first
        setUser(getCurrentUser());
        
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

        // Load payment info from localStorage
        const savedPaymentInfo = localStorage.getItem('paymentInfo');
        if (savedPaymentInfo) {
            setPaymentInfo(JSON.parse(savedPaymentInfo));
        } else {
            // Initialize with default values
            const defaultPayment = { jama: 0, baki: 0 };
            setPaymentInfo(defaultPayment);
            localStorage.setItem('paymentInfo', JSON.stringify(defaultPayment));
        }

        // Clear any existing GST preference and set to false by default
        localStorage.removeItem('includeGST');
        setIncludeGST(false);
        localStorage.setItem('includeGST', JSON.stringify(false));

        setUser(getCurrentUser());
    }, []);

    // Separate useEffect for sample hotel data - runs only for sample hotel
    useEffect(() => {
        if (user?.hotelId === 'sample') {
            // Only populate if no existing data
            if (foodItems.length === 0) {
                const sampleItems = [
                    { code: '101', name: 'Sample Special Thali', rate: 250, quantity: 1 },
                    { code: '201', name: 'Vada Pav', rate: 30, quantity: 2 }
                ];
                setFoodItems(sampleItems);
            }
            
            if (!customerInfo.name) {
                const sampleCustomer = {
                    name: 'Demo Customer',
                    tableNumber: 'T1',
                    phoneNumber: '9876543210'
                };
                setCustomerInfo(sampleCustomer);
            }
        }
    }, [user?.hotelId, foodItems.length, customerInfo.name]);

    const calculateSubtotal = () => {
        return foodItems.reduce((total, item) => total + (item.rate * item.quantity), 0);
    };

    const calculateTax = (subtotal) => {
        return includeGST ? subtotal * 0.18 : 0; // 18% GST only if checkbox is selected
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const tax = calculateTax(subtotal);
        const total = subtotal + tax;
        return Math.ceil(total); // Round up to next whole number
    };

    const handlePrint = () => {
        window.print();
    };

    const handleClearBill = () => {
        if (window.confirm('तुम्हाला खात्री आहे की तुम्ही बिल क्लियर करू इच्छिता?')) {
            localStorage.removeItem('selectedFoods');
            localStorage.removeItem('customerInfo');
            localStorage.removeItem('paymentInfo');
            setFoodItems([]);
            setCustomerInfo({ name: '', tableNumber: '', phoneNumber: '' });
            setPaymentInfo({ jama: 0, baki: 0 });
        }
    };

    const clearBill = () => {
        // Clear localStorage
        localStorage.removeItem('selectedFoods');
        localStorage.removeItem('customerInfo');
        localStorage.removeItem('paymentInfo');
        
        // Clear table order if this was a table order
        if (customerInfo.tableNumber) {
            clearTableOrder(customerInfo.tableNumber);
            console.log('Table order cleared for table:', customerInfo.tableNumber);
        }
        
        // Reset state
        setFoodItems([]);
        setCustomerInfo({ name: '', tableNumber: '', phoneNumber: '' });
        setPaymentInfo({ jama: 0, baki: 0 });
        
        console.log('Bill cleared successfully');
    };

    const handleSaveBill = () => {
        if (foodItems.length === 0) {
            alert('बिल सेव्ह करण्यासाठी आयटम जोडा!');
            return;
        }

        const subtotal = calculateSubtotal();
        const tax = calculateTax(subtotal);
        const total = calculateTotal();

        const billData = {
            billNumber,
            date: currentDate,
            time: currentTime,
            customerInfo,
            items: foodItems,
            subtotal,
            tax,
            total,
            paymentInfo,
            includeGST
        };

        console.log('Attempting to save bill:', billData);
        const success = saveBillToHistory(billData);
        console.log('Save result:', success);
        
        if (success) {
            alert('बिल यशस्वीरित्या सेव्ह झाले!');
            console.log('Bill saved successfully with ID:', success);
            
            // Clear the bill after successful save
            clearBill();
        } else {
            alert('बिल सेव्ह करताना काही त्रुटी झाली. कृपया पुन्हा प्रयत्न करा.');
            console.log('Failed to save bill');
        }
    };

    const handleGSTChange = (e) => {
        const isChecked = e.target.checked;
        setIncludeGST(isChecked);
        localStorage.setItem('includeGST', JSON.stringify(isChecked));
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

    const handlePaymentInfoChange = (e) => {
        const { name, value } = e.target;
        const numValue = parseFloat(value) || 0;
        const updatedPaymentInfo = {
            ...paymentInfo,
            [name]: numValue
        };
        
        // Auto-calculate baki when jama changes
        if (name === 'jama') {
            updatedPaymentInfo.baki = Math.max(0, Math.ceil(total - numValue));
        }
        
        setPaymentInfo(updatedPaymentInfo);
        localStorage.setItem('paymentInfo', JSON.stringify(updatedPaymentInfo));
    };

    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const total = calculateTotal();

    // Update baki when total changes
    useEffect(() => {
        const newBaki = Math.max(0, Math.ceil(total - paymentInfo.jama));
        if (newBaki !== paymentInfo.baki) {
            const updatedPaymentInfo = {
                ...paymentInfo,
                baki: newBaki
            };
            setPaymentInfo(updatedPaymentInfo);
            localStorage.setItem('paymentInfo', JSON.stringify(updatedPaymentInfo));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [total, paymentInfo.jama]);

    const getHotelAddress = () => {
        if (user?.hotelId === 'matoshree') {
            return {
                address: user?.address || "वांबोरी, राहुरी, जिल्हा - अहिल्यानगर, महाराष्ट्र - ४१३७०४",
                phone: "+91 9130195459",
                email: "pratikkale202@gmail.com",
                gstin: "27ABCDE1234F1Z5"
            };
        } else if (user?.hotelId === 'jagdamba') {
            return {
                address: user?.address || "वांबोरी, राहुरी, जिल्हा - अहिल्यानगर, महाराष्ट्र - ४१३७०४",
                phone: "+91 8329376759",
                email: "xxxxxxxx@gmail.com",
                gstin: "xxxxxxxxxxx"
            };
        } else {
            return {
                address: user?.address || "महाराष्ट्र, भारत",
                phone: "+91 9999999999",
                email: "xxxxxxx@gmail.com",
                gstin: "xxxxxxxxxx"
            };
        }
    };

    const hotelInfo = getHotelAddress();

    return (
        <div className="bill-print" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            {/* VK Solutions Branding for Print */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: '2px solid #667eea',
                marginBottom: '20px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img 
                        src={`${process.env.PUBLIC_URL}/images/vk-logo.svg`} 
                        alt="VK Solutions" 
                        style={{ 
                            height: '40px', 
                            width: '40px',
                            borderRadius: '50%',
                            background: 'white',
                            padding: '2px'
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
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#667eea' }}>
                            Powered by VK Solutions
                        </div>
                        <div style={{ fontSize: '11px', color: '#666' }}>
                            📱 +91 9689517133 | 📧 vikas4kale@gmail.com
                        </div>
                    </div>
                </div>
                <div style={{ fontSize: '12px', color: '#666', textAlign: 'right' }}>
                    <div>Professional Software Development</div>
                    <div>Custom IT Solutions</div>
                </div>
            </div>

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
                            fontSize: '14px',
                            ...(user?.hotelId === 'sample' && {
                                backgroundColor: '#f8f9fa',
                                cursor: 'not-allowed'
                            })
                        }}
                        {...(user?.hotelId === 'sample' && { readOnly: true })}
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
                            fontSize: '14px',
                            ...(user?.hotelId === 'sample' && {
                                backgroundColor: '#f8f9fa',
                                cursor: 'not-allowed'
                            })
                        }}
                        {...(user?.hotelId === 'sample' && { readOnly: true })}
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
                            fontSize: '14px',
                            ...(user?.hotelId === 'sample' && {
                                backgroundColor: '#f8f9fa',
                                cursor: 'not-allowed'
                            })
                        }}
                        {...(user?.hotelId === 'sample' && { readOnly: true })}
                        className={user?.hotelId === 'matoshree' ? 'marathi-body' : ''}
                    />
                </div>
            </div>

            {/* Payment Information Section for Input */}
            <div className="payment-input-section" style={{ 
                marginBottom: '20px', 
                padding: '15px', 
                background: '#e8f4fd', 
                borderRadius: '6px',
                border: '1px solid #0066cc'
            }}>
                <h3 style={{ 
                    color: user?.hotelId === 'matoshree' ? '#C41E3A' : '#2c3e50', 
                    marginBottom: '15px',
                    fontSize: '18px'
                }} className={user?.hotelId === 'matoshree' ? 'marathi-header' : ''}>
                    पेमेंट माहिती
                </h3>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '15px',
                    alignItems: 'center'
                }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                            जमा (Received Amount): ₹
                        </label>
                        <input
                            type="number"
                            name="jama"
                            value={paymentInfo.jama}
                            onChange={handlePaymentInfoChange}
                            min="0"
                            step="0.01"
                            style={{
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                width: '100%',
                                ...(user?.hotelId === 'sample' && {
                                    backgroundColor: '#f8f9fa',
                                    cursor: 'not-allowed'
                                })
                            }}
                            {...(user?.hotelId === 'sample' && { readOnly: true })}
                            className={user?.hotelId === 'matoshree' ? 'marathi-body' : ''}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                            बाकी (Balance): ₹
                        </label>
                        <div style={{
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: paymentInfo.baki > 0 ? '#dc3545' : '#28a745',
                            backgroundColor: '#f8f9fa',
                            textAlign: 'center'
                        }}>
                            {paymentInfo.baki}
                        </div>
                    </div>
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

                    {/* GST Checkbox */}
                    <div style={{ 
                        margin: '15px 0', 
                        padding: '10px', 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                    }}>
                        <label style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            <input
                                type="checkbox"
                                checked={includeGST}
                                onChange={handleGSTChange}
                                style={{ 
                                    marginRight: '8px',
                                    transform: 'scale(1.2)'
                                }}
                            />
                            जीएसटी समाविष्ट करा (Include GST 18%)
                        </label>
                    </div>

                    <div className="bill-summary">
                        <div className="summary-row">
                            <span>उपजोड:</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        {includeGST && (
                            <div className="summary-row">
                                <span>जीएसटी (18%):</span>
                                <span>₹{tax.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="total-row">
                            <span>एकूण रक्कम:</span>
                            <span>₹{total}</span>
                        </div>
                        
                        {/* Payment Summary for Print */}
                        <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #ddd' }}>
                            <div className="summary-row">
                                <span>जमा (Received):</span>
                                <span>₹{paymentInfo.jama.toFixed(2)}</span>
                            </div>
                            <div className="summary-row" style={{ 
                                color: paymentInfo.baki > 0 ? '#dc3545' : '#28a745',
                                fontWeight: 'bold'
                            }}>
                                <span>बाकी (Balance):</span>
                                <span>₹{paymentInfo.baki}</span>
                            </div>
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