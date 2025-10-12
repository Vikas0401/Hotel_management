import React, { useState, useEffect } from 'react';
import FoodEntry from '../components/FoodMenu/FoodEntry';
import { getCurrentUser } from '../services/authService';
import { getActiveTables, getAllTableSummaries } from '../services/tableService';
import { useNavigate } from 'react-router-dom';
import '../styles/components/FoodMenu.css';
import '../styles/components/TableMenu.css';

const TableMenuPage = () => {
    const [user, setUser] = useState(null);
    const [activeTables, setActiveTables] = useState([]);
    const [tableSummaries, setTableSummaries] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setUser(getCurrentUser());
        loadTableData();
        
        // Refresh table data every 30 seconds
        const interval = setInterval(loadTableData, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadTableData = () => {
        const tables = getActiveTables();
        setActiveTables(tables);
        
        const summaries = getAllTableSummaries();
        setTableSummaries(summaries);
    };

    const handleViewTableOrders = () => {
        navigate('/table-orders');
    };

    return (
        <div className="table-menu-container">
            <div className="table-menu-header">
                <h1>🍽️ Table Ordering System</h1>
                <p>{user?.hotelName || 'Hotel'} - Add items to specific tables</p>
                
                <div className="table-stats">
                    <div className="stat-card">
                        <span className="stat-number">{activeTables.length}</span>
                        <span className="stat-label">Active Tables</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">
                            {tableSummaries.reduce((total, table) => total + table.itemCount, 0)}
                        </span>
                        <span className="stat-label">Total Items</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">
                            ₹{tableSummaries.reduce((total, table) => total + table.total, 0)}
                        </span>
                        <span className="stat-label">Total Amount</span>
                    </div>
                </div>
            </div>

            <div className="table-menu-content">
                {/* Food Entry Form with Table Support */}
                <div className="food-entry-section">
                    <FoodEntry 
                        enableTableOrdering={true}
                        onFoodSelect={null} // Not used in table mode
                    />
                </div>

                {/* Active Tables Summary */}
                {activeTables.length > 0 && (
                    <div className="active-tables-section">
                        <div className="section-header">
                            <h2>Active Tables Summary</h2>
                            <button 
                                className="view-details-btn"
                                onClick={handleViewTableOrders}
                            >
                                View Detailed Orders
                            </button>
                        </div>
                        
                        <div className="tables-summary-grid">
                            {tableSummaries.map(table => (
                                <div key={table.tableNumber} className="table-summary-card">
                                    <div className="table-summary-header">
                                        <h3>Table {table.tableNumber}</h3>
                                        <span className="table-status">{table.status}</span>
                                    </div>
                                    <div className="table-summary-info">
                                        <p><strong>Items:</strong> {table.itemCount}</p>
                                        <p><strong>Amount:</strong> ₹{table.total}</p>
                                        <p><strong>Started:</strong> {new Date(table.startTime).toLocaleTimeString([], { 
                                            hour: '2-digit', 
                                            minute: '2-digit' 
                                        })}</p>
                                        {table.customerInfo.name && (
                                            <p><strong>Customer:</strong> {table.customerInfo.name}</p>
                                        )}
                                    </div>
                                    <button 
                                        className="table-action-btn"
                                        onClick={() => {
                                            localStorage.setItem('selectedTableForOrder', table.tableNumber);
                                            window.location.reload(); // Refresh to update form
                                        }}
                                    >
                                        Add Items
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="quick-actions-section">
                    <h2>Quick Actions</h2>
                    <div className="action-buttons">
                        <button 
                            className="action-btn primary"
                            onClick={handleViewTableOrders}
                        >
                            📋 Manage Table Orders
                        </button>
                        <button 
                            className="action-btn secondary"
                            onClick={() => navigate('/menu')}
                        >
                            � Parcel Order Mode
                        </button>
                        <button 
                            className="action-btn secondary"
                            onClick={() => navigate('/bill-history')}
                        >
                            📊 Bill History
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableMenuPage;