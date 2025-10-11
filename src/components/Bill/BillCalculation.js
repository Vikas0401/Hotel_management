import React, { useState, useEffect } from 'react';

const BillCalculation = () => {
    const [foodItems, setFoodItems] = useState([]);
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
        setCustomerInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const total = calculateTotalBill();

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
                    </div>
                </>
            ) : (
                <p className="no-items">No items in the bill. Please add items from the menu.</p>
            )}
        </div>
    );
};

export default BillCalculation;