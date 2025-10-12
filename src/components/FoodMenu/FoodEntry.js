import React, { useState, useEffect } from 'react';
import { getHotelMenu } from '../../services/menuService';
import { getCurrentUser } from '../../services/authService';
import { addFoodToTable, getActiveTables } from '../../services/tableService';
import '../../styles/components/FoodMenu.css';

const FoodEntry = ({ onFoodSelect, enableTableOrdering = false }) => {
    const [foodItems, setFoodItems] = useState({});
    const [foodCode, setFoodCode] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedTable, setSelectedTable] = useState('');
    const [newTableNumber, setNewTableNumber] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [user, setUser] = useState(null);
    const [activeTables, setActiveTables] = useState([]);

    useEffect(() => {
        loadMenu();
        setUser(getCurrentUser());
        
        if (enableTableOrdering) {
            loadActiveTables();
            // Check if there's a pre-selected table from localStorage
            const preSelectedTable = localStorage.getItem('selectedTableForOrder');
            if (preSelectedTable) {
                setSelectedTable(preSelectedTable);
                localStorage.removeItem('selectedTableForOrder');
            }
        }
    }, [enableTableOrdering]);

    const loadMenu = () => {
        const menu = getHotelMenu();
        setFoodItems(menu);
    };

    const loadActiveTables = () => {
        const tables = getActiveTables();
        setActiveTables(tables);
    };

    const handleFoodCodeChange = (e) => {
        setFoodCode(e.target.value);
        setError('');
        setSuccess('');
    };

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    const handleTableChange = (e) => {
        setSelectedTable(e.target.value);
        setNewTableNumber('');
        setError('');
        setSuccess('');
    };

    const handleNewTableChange = (e) => {
        setNewTableNumber(e.target.value);
        setSelectedTable('');
        setError('');
        setSuccess('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate food code
        if (!foodItems[foodCode]) {
            setError('Invalid food code');
            return;
        }

        const selectedFood = {
            code: foodCode,
            name: foodItems[foodCode].name,
            rate: foodItems[foodCode].rate,
            quantity: parseInt(quantity)
        };

        if (enableTableOrdering) {
            // Table-based ordering
            const tableNumber = selectedTable || newTableNumber;
            
            if (!tableNumber.trim()) {
                setError('Please select an existing table or enter a new table number');
                return;
            }

            // Add food to specific table
            try {
                addFoodToTable(tableNumber.trim(), selectedFood);
                setSuccess(`Added ${selectedFood.name} (${quantity}x) to Table ${tableNumber}`);
                
                // Refresh active tables list
                loadActiveTables();
                
                // Reset form
                setFoodCode('');
                setQuantity(1);
                
                // If it's a new table, add it to selected table
                if (newTableNumber) {
                    setSelectedTable(newTableNumber);
                    setNewTableNumber('');
                }
                
                // Clear success message after 3 seconds
                setTimeout(() => setSuccess(''), 3000);
                
            } catch (error) {
                setError('Failed to add item to table');
            }
        } else {
            // Original single-order mode
            onFoodSelect(selectedFood);
            setFoodCode('');
            setQuantity(1);
        }
    };

    // Group menu items by category
    const groupedMenu = {};
    Object.entries(foodItems).forEach(([code, item]) => {
        if (!groupedMenu[item.category]) {
            groupedMenu[item.category] = [];
        }
        groupedMenu[item.category].push({ code, ...item });
    });

    return (
        <div className="food-entry-container">
            {/* Mobile-first: Add Items form at the top */}
            <div className="food-entry-form">
                <h2>{enableTableOrdering ? 'Add Items to Table Order' : 'Add Items to Parcel Order'}</h2>
                <form onSubmit={handleSubmit}>
                    {enableTableOrdering && (
                        <div className="table-selection-section">
                            <h3>Select Table</h3>
                            <div className="table-options">
                                {activeTables.length > 0 && (
                                    <div className="form-group">
                                        <label>
                                            Existing Active Tables:
                                            <select 
                                                value={selectedTable} 
                                                onChange={handleTableChange}
                                                className="form-input"
                                            >
                                                <option value="">Select existing table...</option>
                                                {activeTables.map(tableNumber => (
                                                    <option key={tableNumber} value={tableNumber}>
                                                        Table {tableNumber}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                    </div>
                                )}
                                <div className="form-group">
                                    <label>
                                        Or Enter New Table Number:
                                        <input 
                                            type="text" 
                                            value={newTableNumber} 
                                            onChange={handleNewTableChange}
                                            placeholder="e.g., T1, Table 5, etc."
                                            className="form-input"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="form-group">
                        <label>
                            Food Code:
                            <input 
                                type="text" 
                                value={foodCode} 
                                onChange={handleFoodCodeChange}
                                placeholder="Enter food code (e.g., 101)"
                                className="form-input"
                                required
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Quantity:
                            <input 
                                type="number" 
                                value={quantity} 
                                onChange={handleQuantityChange} 
                                min="1"
                                className="form-input"
                                required
                            />
                        </label>
                    </div>
                    <button type="submit" className="add-button">
                        {enableTableOrdering ? 'Add to Table' : 'Add to Parcel Order'}
                    </button>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                </form>
            </div>
            
            {/* Menu display below the form */}
            <div className="menu-display">
                <h2>{user?.hotelName} - Menu</h2>
                <div className="menu-categories">
                    {Object.entries(groupedMenu).map(([category, items]) => (
                        <div key={category} className="menu-category">
                            <h3>{category}</h3>
                            <ul>
                                {items.map((item) => (
                                    <li key={item.code}>
                                        {item.code} - {item.name} - ₹{item.rate}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FoodEntry;