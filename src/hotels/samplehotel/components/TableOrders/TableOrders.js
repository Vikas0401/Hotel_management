import React, { useState, useEffect, useCallback } from 'react';
// import {
//     getActiveTables,
//     getTableOrder,
//     getTableOrderSummary,
//     completeTableOrder
// } from '../../services/tableService';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/TableOrders.css';

// Mock data for demonstration
const mockActiveTables = ['1', '3', '5'];

const mockTableDetails = {
    '1': {
        startTime: new Date().toISOString(),
        items: [
            { code: '101', name: 'Paneer Tikka', rate: 250, quantity: 2, addedAt: new Date().toISOString() },
            { code: '102', name: 'Dal Makhani', rate: 200, quantity: 1, addedAt: new Date().toISOString() },
        ],
    },
    '3': {
        startTime: new Date().toISOString(),
        items: [
            { code: '201', name: 'Chicken Biryani', rate: 350, quantity: 1, addedAt: new Date().toISOString() },
        ],
    },
    '5': {
        startTime: new Date().toISOString(),
        items: [
            { code: '301', name: 'Veg Pulao', rate: 180, quantity: 2, addedAt: new Date().toISOString() },
            { code: '302', name: 'Raita', rate: 60, quantity: 2, addedAt: new Date().toISOString() },
        ],
    },
};

const TableOrders = () => {
    const [activeTables, setActiveTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [tableDetails, setTableDetails] = useState(null);
    const navigate = useNavigate();

    const loadActiveTables = useCallback(() => {
        // const tables = getActiveTables();
        setActiveTables(mockActiveTables);

        if (selectedTable && !mockActiveTables.includes(selectedTable)) {
            setSelectedTable(null);
            setTableDetails(null);
        }
    }, [selectedTable]);

    useEffect(() => {
        loadActiveTables();
        const interval = setInterval(loadActiveTables, 30000);
        return () => clearInterval(interval);
    }, [loadActiveTables]);

    const getTableOrderSummary = (tableNumber) => {
        const details = mockTableDetails[tableNumber];
        if (!details) {
            return { itemCount: 0, total: 0, startTime: new Date().toISOString() };
        }
        const itemCount = details.items.reduce((acc, item) => acc + item.quantity, 0);
        const total = details.items.reduce((acc, item) => acc + item.rate * item.quantity, 0);
        return { itemCount, total, startTime: details.startTime };
    };

    const handleTableSelect = (tableNumber) => {
        setSelectedTable(tableNumber);
        // const details = getTableOrder(tableNumber);
        const details = mockTableDetails[tableNumber];
        setTableDetails(details);
    };

    const handleCompleteOrder = (tableNumber) => {
        alert(`Order for table ${tableNumber} would be completed here in a real scenario.`);
        // const completedOrder = completeTableOrder(tableNumber);
        // if (completedOrder) {
        //     localStorage.setItem('selectedFoods', JSON.stringify(completedOrder.items));
        //     localStorage.setItem('customerInfo', JSON.stringify({
        //         name: completedOrder.customerInfo.name || '',
        //         tableNumber: tableNumber,
        //         phoneNumber: completedOrder.customerInfo.phoneNumber || ''
        //     }));
        //     navigate('/bill');
        // }
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
                <h1> Table Orders Management - Active: {activeTables.length}</h1>
            </div>

            <div className="table-orders-content">
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

                <div className="table-details-panel">
                    {selectedTable && tableDetails ? (
                        <>
                            <div className="table-details-header">
                                <h2>Table {selectedTable} - Order Details</h2>
                                <p>Started: {formatTime(tableDetails.startTime)}</p>
                            </div>

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

                            <div className="action-buttons">
                                <button
                                    className="add-items-btn"
                                    onClick={() => {
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