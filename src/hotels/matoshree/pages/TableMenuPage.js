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
    const [expandedSections, setExpandedSections] = useState({
        foodEntry: true,  // Start with food entry expanded
        activeTables: false,  // Keep active tables collapsed initially
        quickActions: false   // Keep quick actions collapsed initially
    });
    const navigate = useNavigate();

    useEffect(() => {
        setUser(getCurrentUser());
        loadTableData();
        
        // Refresh table data every 10 seconds for more real-time updates
        const interval = setInterval(loadTableData, 10000);
        
        // Also refresh when window gets focus
        const handleFocus = () => loadTableData();
        window.addEventListener('focus', handleFocus);
        
        return () => {
            clearInterval(interval);
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    const loadTableData = () => {
        const tables = getActiveTables();
        setActiveTables(tables);
        
        const summaries = getAllTableSummaries();
        setTableSummaries(summaries);
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleViewTableOrders = () => {
        navigate('../table-orders');
    };

    return (
        <div className="table-menu-container" style={{ paddingTop: '140px' }}>
            <div className="table-menu-header">
                <h1>🍽️ {user?.hotelName || 'Hotel'} - Table Ordering</h1>
                
                <div className="table-stats">
                    <div className="stat-card">
                        <span className="stat-number">{activeTables.length}</span>
                        <span className="stat-label">Tables</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">
                            {tableSummaries.reduce((total, table) => total + table.itemCount, 0)}
                        </span>
                        <span className="stat-label">Items</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">
                            ₹{tableSummaries.reduce((total, table) => total + table.total, 0)}
                        </span>
                        <span className="stat-label">Amount</span>
                    </div>
                </div>
            </div>

            <div className="table-menu-content">
                {/* Left Side - Food Entry Form with Table Support */}
                <div className="food-entry-section">
                    <div className="section-header-collapsible" onClick={() => toggleSection('foodEntry')}>
                        <h2>🍽️ Add Items to Table</h2>
                        <span className={`collapse-icon ${expandedSections.foodEntry ? 'expanded' : ''}`}>
                            ▼
                        </span>
                    </div>
                    {expandedSections.foodEntry && (
                        <div className="section-content">
                            <FoodEntry 
                                enableTableOrdering={true}
                                onFoodSelect={null} // Not used in table mode
                                onTableDataChange={loadTableData} // Refresh table data when items are added
                            />
                        </div>
                    )}
                </div>

                {/* Right Side - Container for Active Tables and Quick Actions */}
                <div className="right-side-container">
                    {/* Active Tables Summary */}
                    {activeTables.length > 0 && (
                        <div className="active-tables-section">
                            <div className="section-header-collapsible" onClick={() => toggleSection('activeTables')}>
                                <h2>📋 Active Tables Summary ({activeTables.length})</h2>
                                <div className="header-actions">
                                    <button 
                                        className="view-details-btn"
                                        onClick={handleViewTableOrders}
                                    >
                                        View Detailed Orders
                                    </button>
                                    <span className={`collapse-icon ${expandedSections.activeTables ? 'expanded' : ''}`}>
                                        ▼
                                    </span>
                                </div>
                            </div>
                            
                            {expandedSections.activeTables && (
                                <div className="section-content">
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
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="quick-actions-section">
                        <div className="section-header-collapsible" onClick={() => toggleSection('quickActions')}>
                            <h2>⚡ Quick Actions</h2>
                            <span className={`collapse-icon ${expandedSections.quickActions ? 'expanded' : ''}`}>
                                ▼
                            </span>
                        </div>
                        {expandedSections.quickActions && (
                            <div className="section-content">
                                <div className="action-buttons">
                                    <button 
                                        className="action-btn primary"
                                        onClick={handleViewTableOrders}
                                    >
                                        📋 Manage Table Orders
                                    </button>
                                    <button 
                                        className="action-btn secondary"
                                        onClick={() => navigate('../menu')}
                                    >
                                        📦 Parcel Order Mode
                                    </button>
                                    <button 
                                        className="action-btn secondary"
                                        onClick={() => navigate('../bill-history')}
                                    >
                                        📊 Bill History
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableMenuPage;