import React, { useState, useEffect } from 'react';

const BillCalculation = () => {
    const [foodItems, setFoodItems] = useState([]);
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        tableNumber: '',
        phoneNumber: ''
    });
    const [paymentInfo, setPaymentInfo] = useState({
        jama: 0, // received amount
        baki: 0  // remaining balance
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
    }, []);

    const calculateSubtotal = () => {
        return foodItems.reduce((total, item) => total + (item.rate * item.quantity), 0);
    };

    const calculateTax = (subtotal) => {
        return subtotal * 0.18; // 18% GST
    };

    const calculateTotalBill = () => {
        const subtotal = calculateSubtotal();
        const tax = calculateTax(subtotal);
        return subtotal + tax;
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
            updatedPaymentInfo.baki = Math.max(0, total - numValue);
        }
        
        setPaymentInfo(updatedPaymentInfo);
        localStorage.setItem('paymentInfo', JSON.stringify(updatedPaymentInfo));
    };

    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const total = calculateTotalBill();

    // Update baki when total changes
    useEffect(() => {
        const newBaki = Math.max(0, total - paymentInfo.jama);
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

    return (
        <div className="bill-calculation">
            <h2>Bill Summary</h2>
            
            {/* Customer Information */}
            <div className="customer-info">
                <h3>Customer Information</h3>
                <div className="info-form">
                    <input
                        type="text"
                        name="name"
                        placeholder="Customer Name"
                        value={customerInfo.name}
                        onChange={handleCustomerInfoChange}
                        className="info-input"
                    />
                    <input
                        type="text"
                        name="tableNumber"
                        placeholder="Table Number"
                        value={customerInfo.tableNumber}
                        onChange={handleCustomerInfoChange}
                        className="info-input"
                    />
                    <input
                        type="text"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={customerInfo.phoneNumber}
                        onChange={handleCustomerInfoChange}
                        className="info-input"
                    />
                </div>
            </div>

            {/* Bill Items */}
            {foodItems.length > 0 ? (
                <>
                    <table className="bill-table">
                        <thead>
                            <tr>
                                <th>Item Code</th>
                                <th>Item Name</th>
                                <th>Rate (₹)</th>
                                <th>Qty</th>
                                <th>Amount (₹)</th>
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
                            <span>Subtotal:</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>GST (18%):</span>
                            <span>₹{tax.toFixed(2)}</span>
                        </div>
                        <div className="summary-row total-row">
                            <span>Total Amount:</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                        
                        {/* Payment Information */}
                        <div className="payment-info" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                            <h4 style={{ marginBottom: '15px', color: '#495057' }}>Payment Details</h4>
                            <div className="payment-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <label htmlFor="jama" style={{ fontWeight: '500' }}>Jama (Received): ₹</label>
                                <input
                                    type="number"
                                    id="jama"
                                    name="jama"
                                    value={paymentInfo.jama}
                                    onChange={handlePaymentInfoChange}
                                    min="0"
                                    step="0.01"
                                    style={{
                                        padding: '8px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        width: '120px',
                                        textAlign: 'right'
                                    }}
                                />
                            </div>
                            <div className="payment-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: '500' }}>Baki (Balance): </span>
                                <span style={{ 
                                    fontWeight: 'bold', 
                                    color: paymentInfo.baki > 0 ? '#dc3545' : '#28a745',
                                    fontSize: '16px'
                                }}>
                                    ₹{paymentInfo.baki.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <p className="no-items">No items in the bill. Please add items from the menu.</p>
            )}
        </div>
    );
};

export default BillCalculation;