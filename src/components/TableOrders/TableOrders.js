import React, { useState, useEffect } from 'react';
import { 
    getActiveTables, 
    getTableOrder, 
    getTableOrderSummary,
    completeTableOrder,
    clearTableOrder 
} from '../../services/tableService';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/TableOrders.css';

const TableOrders = () => {
    const [activeTables, setActiveTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [tableDetails, setTableDetails] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadActiveTables();
        // Refresh every 30 seconds to show real-time updates
        const interval = setInterval(loadActiveTables, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadActiveTables = () => {
        const tables = getActiveTables();
        setActiveTables(tables);
        
        // If selected table is no longer active, clear selection
        if (selectedTable && !tables.includes(selectedTable)) {
            setSelectedTable(null);
            setTableDetails(null);
        }
    };

    const handleTableSelect = (tableNumber) => {
        setSelectedTable(tableNumber);
        const details = getTableOrder(tableNumber);
        setTableDetails(details);
    };

    const handleCompleteOrder = (tableNumber) => {
        const completedOrder = completeTableOrder(tableNumber);
        if (completedOrder) {
            // Store the completed order data for billing
            localStorage.setItem('selectedFoods', JSON.stringify(completedOrder.items));
            localStorage.setItem('customerInfo', JSON.stringify({
                name: completedOrder.customerInfo.name || '',
                tableNumber: tableNumber,
                phoneNumber: completedOrder.customerInfo.phoneNumber || ''
            }));
            
            // Navigate to bill page
            navigate('/bill');
        }
    };

    const calculateItemTotal = (item) => {
        return item.rate * item.quantity;
    };

    const calculateTableTotal = (items) => {
        return items.reduce((total, item) => total + calculateItemTotal(item), 0);
    };

    const formatTime = (isoString) => {
        return new Date(isoString).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    return (
        <div className="table-orders-container">
            <div className="table-orders-header">
                <h1>🍽️ Table Orders Management</h1>
                <p>Active Tables: {activeTables.length}</p>
            </div>

            <div className="table-orders-content">
                {/* Left Panel - Active Tables List */}
                <div className="tables-list-panel">
                    <h2>Active Tables</h2>
                    {activeTables.length === 0 ? (
                        <div className="no-tables">
                            <p>No active table orders</p>
                            <button 
                                className="new-order-btn"
                                onClick={() => navigate('/menu')}
                            >
                                Start New Order
                            </button>
                        </div>
                    ) : (
                        <div className="tables-grid">
                            {activeTables.map(tableNumber => {
                                const summary = getTableOrderSummary(tableNumber);
                                return (
                                    <div 
                                        key={tableNumber}
                                        className={`table-card ${selectedTable === tableNumber ? 'selected' : ''}`}
                                        onClick={() => handleTableSelect(tableNumber)}
                                    >
                                        <div className="table-number">
                                            {tableNumber}
                                        </div>
                                        <div className="table-info">
                                            <p className="item-count">
                                                {summary.itemCount} items
                                            </p>
                                            <p className="table-total">
                                                ₹{summary.total}
                                            </p>
                                            <p className="start-time">
                                                Started: {formatTime(summary.startTime)}
                                            </p>
                                        </div>
                                        <button 
                                            className="complete-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCompleteOrder(tableNumber);
                                            }}
                                        >
                                            Complete Order
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right Panel - Table Details */}
                <div className="table-details-panel">
                    {selectedTable && tableDetails ? (
                        <>
                            <div className="table-details-header">
                                <h2>Table {selectedTable} - Order Details</h2>
                                <p>Started: {formatTime(tableDetails.startTime)}</p>
                            </div>

                            {/* Customer Info */}
                            <div className="customer-info-section">
                                <h3>Customer Information</h3>
                                <div className="customer-details">
                                    <p><strong>Name:</strong> {tableDetails.customerInfo.name || 'Not provided'}</p>
                                    <p><strong>Phone:</strong> {tableDetails.customerInfo.phoneNumber || 'Not provided'}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="order-items-section">
                                <h3>Order Items ({tableDetails.items.length})</h3>
                                {tableDetails.items.length === 0 ? (
                                    <p className="no-items">No items in this order</p>
                                ) : (
                                    <div className="items-table-container">
                                        <table className="items-table">
                                            <thead>
                                                <tr>
                                                    <th>Code</th>
                                                    <th>Item</th>
                                                    <th>Rate</th>
                                                    <th>Qty</th>
                                                    <th>Amount</th>
                                                    <th>Added At</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tableDetails.items.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.code}</td>
                                                        <td>{item.name}</td>
                                                        <td>₹{item.rate}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>₹{calculateItemTotal(item)}</td>
                                                        <td>{formatTime(item.addedAt)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Order Summary */}
                            <div className="order-summary-section">
                                <div className="summary-row">
                                    <span>Total Items:</span>
                                    <span>{tableDetails.items.reduce((count, item) => count + item.quantity, 0)}</span>
                                </div>
                                <div className="summary-row total-row">
                                    <span><strong>Total Amount:</strong></span>
                                    <span><strong>₹{calculateTableTotal(tableDetails.items)}</strong></span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="action-buttons">
                                <button 
                                    className="add-items-btn"
                                    onClick={() => {
                                        // Set selected table in localStorage for menu page
                                        localStorage.setItem('selectedTableForOrder', selectedTable);
                                        navigate('/menu');
                                    }}
                                >
                                    Add More Items
                                </button>
                                <button 
                                    className="complete-order-btn"
                                    onClick={() => handleCompleteOrder(selectedTable)}
                                >
                                    Complete & Generate Bill
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="no-selection">
                            <h2>Select a table to view details</h2>
                            <p>Click on any active table from the left panel to see order details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TableOrders;