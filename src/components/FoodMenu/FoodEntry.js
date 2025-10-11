import React, { useState, useEffect } from 'react';
import { getHotelMenu } from '../../services/menuService';
import { getCurrentUser } from '../../services/authService';
import '../../styles/components/FoodMenu.css';

const FoodEntry = ({ onFoodSelect }) => {
    const [foodItems, setFoodItems] = useState({});
    // const [categories, setCategories] = useState([]);
    const [foodCode, setFoodCode] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        loadMenu();
        setUser(getCurrentUser());
    }, []);

    const loadMenu = () => {
        const menu = getHotelMenu();
        setFoodItems(menu);
        // setCategories(getMenuCategories());
    };

    const handleFoodCodeChange = (e) => {
        setFoodCode(e.target.value);
        setError('');
    };

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (foodItems[foodCode]) {
            const selectedFood = {
                code: foodCode,
                name: foodItems[foodCode].name,
                rate: foodItems[foodCode].rate,
                quantity: parseInt(quantity)
            };
            onFoodSelect(selectedFood);
            setFoodCode('');
            setQuantity(1);
        } else {
            setError('Invalid food code');
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
                <h2>Add Items to Order</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>
                            Food Code:
                            <input 
                                type="text" 
                                value={foodCode} 
                                onChange={handleFoodCodeChange}
                                placeholder="Enter food code (e.g., 101)"
                                className="form-input"
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
                            />
                        </label>
                    </div>
                    <button type="submit" className="add-button">Add to Order</button>
                    {error && <p className="error-message">{error}</p>}
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