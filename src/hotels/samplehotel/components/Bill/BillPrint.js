import React, { useState } from 'react';

// Mock data for demonstration
const mockFoodItems = [
    { code: '101', name: 'Sample Special Thali', rate: 250, quantity: 1 },
    { code: '201', name: 'Vada Pav', rate: 30, quantity: 2 },
];

const mockCustomerInfo = {
    name: 'Demo Customer',
    tableNumber: 'T1',
    phoneNumber: '9876543210',
};

const BillPrint = () => {
    const [foodItems] = useState(mockFoodItems);
    const [billNumber] = useState('B123456');
    const [currentDate] = useState(new Date().toLocaleDateString());
    const [currentTime] = useState(new Date().toLocaleTimeString());
    const [customerInfo] = useState(mockCustomerInfo);
    const [includeGST, setIncludeGST] = useState(false);

    const calculateSubtotal = () => {
        return foodItems.reduce((total, item) => total + item.rate * item.quantity, 0);
    };

    const calculateTax = (subtotal) => {
        return includeGST ? subtotal * 0.18 : 0;
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const tax = calculateTax(subtotal);
        return Math.ceil(subtotal + tax);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleClearBill = () => {
        alert('This is a sample bill and cannot be cleared.');
    };

    const handleSaveBill = () => {
        alert('This is a sample bill and cannot be saved.');
    };

    const handleGSTChange = (e) => {
        setIncludeGST(e.target.checked);
    };

    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const total = calculateTotal();

    const hotelInfo = {
        address: "Sample Hotel Address, Maharashtra, India",
        phone: "+91 1234567890",
        email: "sample.hotel@example.com",
        gstin: "27SAMPLE1234F1Z5",
    };

    return (
        <div className="bill-print" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
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
                <h1 style={{
                    color: '#2c3e50',
                    fontSize: '2em',
                    margin: '0 0 10px 0',
                }}>
                    Sample Hotel
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
                <div><strong>Bill No: </strong>{billNumber}</div>
                <div><strong>Date: </strong>{currentDate}</div>
                <div><strong>Time: </strong>{currentTime}</div>
            </div>

            <div className="customer-info" style={{ 
                marginBottom: '20px', 
                padding: '15px', 
                background: '#f8f9fa', 
                borderRadius: '6px',
                border: '1px solid #ddd'
            }}>
                <h3 style={{ color: '#2c3e50', marginBottom: '15px', fontSize: '18px' }}>
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
                        readOnly
                        style={{
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            backgroundColor: '#f8f9fa',
                            cursor: 'not-allowed'
                        }}
                    />
                    <input
                        type="text"
                        name="tableNumber"
                        placeholder="टेबल नंबर"
                        value={customerInfo.tableNumber}
                        readOnly
                        style={{
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            backgroundColor: '#f8f9fa',
                            cursor: 'not-allowed'
                        }}
                    />
                    <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="मोबाइल नंबर"
                        value={customerInfo.phoneNumber}
                        readOnly
                        style={{
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            backgroundColor: '#f8f9fa',
                            cursor: 'not-allowed'
                        }}
                    />
                </div>
            </div>

            {foodItems.length > 0 ? (
                <>
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

                    <div style={{ 
                        margin: '15px 0', 
                        padding: '10px', 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                    }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
                            <input
                                type="checkbox"
                                checked={includeGST}
                                onChange={handleGSTChange}
                                style={{ marginRight: '8px', transform: 'scale(1.2)' }}
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
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
                        <p>Sample Hotel ला भेट दिल्याबद्दल धन्यवाद!</p>
                        <p>पुन्हा लवकर भेट द्या!</p>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={handleSaveBill} className="save-button" style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' }}>
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
                    <p>There are no items to display in this sample bill.</p>
                </div>
            )}
        </div>
    );
};

export default BillPrint;
