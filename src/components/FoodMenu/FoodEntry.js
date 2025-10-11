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
            
            <div className="menu-display">
                <h2>Maharashtra Hotel Menu</h2>
                <div className="menu-categories">
                    <div className="menu-category">
                        <h3>Main Course - Rice Items (101-106)</h3>
                        <ul>
                            <li>101 - Veg Biryani - ₹180</li>
                            <li>102 - Chicken Biryani - ₹220</li>
                            <li>103 - Mutton Biryani - ₹280</li>
                            <li>104 - Plain Rice - ₹80</li>
                            <li>105 - Jeera Rice - ₹120</li>
                            <li>106 - Pulao - ₹150</li>
                        </ul>
                    </div>
                    
                    <div className="menu-category">
                        <h3>Rotis & Breads (201-205)</h3>
                        <ul>
                            <li>201 - Chapati - ₹15</li>
                            <li>202 - Bhakri - ₹20</li>
                            <li>203 - Naan - ₹35</li>
                            <li>204 - Butter Naan - ₹45</li>
                            <li>205 - Puran Poli - ₹60</li>
                        </ul>
                    </div>
                    
                    <div className="menu-category">
                        <h3>Maharashtrian Specialties (301-310)</h3>
                        <ul>
                            <li>301 - Vada Pav - ₹25</li>
                            <li>302 - Misal Pav - ₹80</li>
                            <li>303 - Pav Bhaji - ₹90</li>
                            <li>304 - Bhel Puri - ₹40</li>
                            <li>305 - Sev Puri - ₹50</li>
                            <li>306 - Dahi Puri - ₹60</li>
                            <li>307 - Poha - ₹45</li>
                            <li>308 - Upma - ₹40</li>
                            <li>309 - Sabudana Khichdi - ₹70</li>
                            <li>310 - Thalipeeth - ₹65</li>
                        </ul>
                    </div>
                    
                    <div className="menu-category">
                        <h3>Curry & Sabji (401-410)</h3>
                        <ul>
                            <li>401 - Dal Tadka - ₹110</li>
                            <li>402 - Dal Fry - ₹100</li>
                            <li>403 - Amti (Maharashtrian Dal) - ₹120</li>
                            <li>404 - Bhendi Fry - ₹140</li>
                            <li>405 - Aloo Gobi - ₹130</li>
                            <li>406 - Palak Paneer - ₹160</li>
                            <li>407 - Paneer Butter Masala - ₹180</li>
                            <li>408 - Chicken Curry - ₹200</li>
                            <li>409 - Mutton Curry - ₹250</li>
                            <li>410 - Fish Curry (Koliwada) - ₹220</li>
                        </ul>
                    </div>
                    
                    <div className="menu-category">
                        <h3>Drinks & Beverages (501-508)</h3>
                        <ul>
                            <li>501 - Sol Kadhi - ₹40</li>
                            <li>502 - Buttermilk (Taak) - ₹30</li>
                            <li>503 - Sugarcane Juice - ₹35</li>
                            <li>504 - Tea - ₹15</li>
                            <li>505 - Coffee - ₹20</li>
                            <li>506 - Masala Tea - ₹20</li>
                            <li>507 - Cold Drink - ₹25</li>
                            <li>508 - Fresh Lime Water - ₹30</li>
                        </ul>
                    </div>
                    
                    <div className="menu-category">
                        <h3>Sweets & Desserts (601-606)</h3>
                        <ul>
                            <li>601 - Modak - ₹50</li>
                            <li>602 - Puran Poli - ₹60</li>
                            <li>603 - Shrikhand - ₹80</li>
                            <li>604 - Basundi - ₹70</li>
                            <li>605 - Gulab Jamun - ₹60</li>
                            <li>606 - Rasgulla - ₹50</li>
                        </ul>
                    </div>
                </div>
            </div>
            
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
                                placeholder="Enter food code (e.g., 301)"
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
        </div>
    );
};

export default FoodEntry;