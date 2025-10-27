import React, { useState, useEffect } from 'react';
import FoodEntry from '../components/FoodMenu/FoodEntry';
import FoodSelection from '../components/FoodMenu/FoodSelection';
import MenuManagement from '../components/Menu/MenuManagement';
import { getCurrentUser } from '../services/authService';
import '../styles/components/FoodMenu.css';
import '../styles/components/MenuManagement.css';

const MenuPage = () => {
    const [selectedFoods, setSelectedFoods] = useState([]);
    const [showManagement, setShowManagement] = useState(false);
    const [user, setUser] = useState(null);
    const [menuKey, setMenuKey] = useState(0); // Force re-render when menu updates

    useEffect(() => {
        setUser(getCurrentUser());
        // Load selected foods from localStorage
        const savedFoods = localStorage.getItem('selectedFoods');
        if (savedFoods) {
            setSelectedFoods(JSON.parse(savedFoods));
        }
    }, []);

    const handleFoodSelect = (selectedFood) => {
        // Check if the food item already exists in the order
        const existingFoodIndex = selectedFoods.findIndex(food => food.code === selectedFood.code);
        
        let updatedFoods;
        if (existingFoodIndex !== -1) {
            // If food exists, update the quantity
            updatedFoods = [...selectedFoods];
            updatedFoods[existingFoodIndex].quantity += selectedFood.quantity;
        } else {
            // If new food item, add to the list
            updatedFoods = [...selectedFoods, selectedFood];
        }
        
        setSelectedFoods(updatedFoods);
        localStorage.setItem('selectedFoods', JSON.stringify(updatedFoods));
    };

    const handleRemoveFood = (index) => {
        const updatedFoods = selectedFoods.filter((_, i) => i !== index);
        setSelectedFoods(updatedFoods);
        localStorage.setItem('selectedFoods', JSON.stringify(updatedFoods));
    };

    const handleMenuUpdate = () => {
        // Force re-render of FoodEntry component when menu is updated
        setMenuKey(prev => prev + 1);
    };

    // Determine button classes based on state (theme-driven gradients)
    const getButtonClass = () => {
        if (showManagement) {
            return 'btn btn-gradient-secondary';
        }
        return 'btn btn-gradient-primary';
    };

    return (
        <div className="page-wrapper">
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                margin: '20px 0', 
                padding: '0 20px' 
            }}>
                <h1 className={`themed-title ${user?.hotelId === 'matoshree' ? 'menu-page-title' : ''}`}>
                    <span className={user?.hotelId === 'matoshree' ? 'hotel-matoshree-name' : ''}>{user?.hotelName}</span> - पार्सल ऑर्डर {showManagement ? 'व्यवस्थापन' : ''}
                </h1>
                {user?.isAdmin && (
                    <button
                        onClick={() => setShowManagement(!showManagement)}
                        className={getButtonClass()}
                    >
                        {showManagement ? 'मेनूवर परत जा' : 'मेनू व्यवस्थापन'}
                    </button>
                )}
            </div>

            {showManagement && user?.isAdmin ? (
                <MenuManagement onMenuUpdate={handleMenuUpdate} />
            ) : (
                <>
                    <FoodEntry 
                        key={menuKey} 
                        onFoodSelect={handleFoodSelect}
                        selectedFoods={selectedFoods}
                    />
                    <FoodSelection 
                        selectedFoods={selectedFoods} 
                        onRemoveFood={handleRemoveFood}
                    />
                </>
            )}
        </div>
    );
};

export default MenuPage;