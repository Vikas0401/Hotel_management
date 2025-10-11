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

    const getButtonStyle = () => {
        const baseStyle = {
            padding: '10px 20px',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        };

        if (user?.hotelId === 'matoshree') {
            if (showManagement) {
                // Back to Menu button (secondary style for Matoshree)
                return {
                    ...baseStyle,
                    background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
                    color: '#2C1810',
                    border: '2px solid #C41E3A',
                    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
                };
            } else {
                // Manage Menu button (primary style for Matoshree)
                return {
                    ...baseStyle,
                    background: 'linear-gradient(135deg, #C41E3A, #A01B32)',
                    border: '2px solid #FFD700',
                    boxShadow: '0 4px 15px rgba(196, 30, 58, 0.3)'
                };
            }
        } else {
            // Default hotel styling
            return {
                ...baseStyle,
                backgroundColor: showManagement ? '#dc3545' : '#007bff'
            };
        }
    };

    const handleButtonHover = (e, isHover) => {
        if (user?.hotelId === 'matoshree') {
            if (showManagement) {
                // Back to Menu hover
                e.target.style.background = isHover 
                    ? 'linear-gradient(135deg, #FF8C00, #FFD700)' 
                    : 'linear-gradient(135deg, #FFD700, #FF8C00)';
                e.target.style.transform = isHover ? 'translateY(-2px)' : 'translateY(0)';
                e.target.style.boxShadow = isHover 
                    ? '0 6px 20px rgba(255, 140, 0, 0.4)' 
                    : '0 4px 15px rgba(255, 215, 0, 0.3)';
            } else {
                // Manage Menu hover
                e.target.style.background = isHover 
                    ? 'linear-gradient(135deg, #A01B32, #C41E3A)' 
                    : 'linear-gradient(135deg, #C41E3A, #A01B32)';
                e.target.style.transform = isHover ? 'translateY(-2px)' : 'translateY(0)';
                e.target.style.boxShadow = isHover 
                    ? '0 6px 20px rgba(196, 30, 58, 0.4)' 
                    : '0 4px 15px rgba(196, 30, 58, 0.3)';
            }
        } else {
            // Default hotel hover
            e.target.style.backgroundColor = isHover 
                ? (showManagement ? '#c82333' : '#0056b3')
                : (showManagement ? '#dc3545' : '#007bff');
        }
    };

    return (
        <div>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                margin: '20px 0', 
                padding: '0 20px' 
            }}>
                <h1 style={{ color: user?.hotelId === 'matoshree' ? '#C41E3A' : '#2c3e50' }} className={user?.hotelId === 'matoshree' ? 'menu-page-title' : ''}>
                    <span className={user?.hotelId === 'matoshree' ? 'hotel-matoshree-name' : ''}>{user?.hotelName}</span> - मेनू {showManagement ? 'व्यवस्थापन' : ''}
                </h1>
                {user?.isAdmin && (
                    <button
                        onClick={() => setShowManagement(!showManagement)}
                        style={getButtonStyle()}
                        onMouseEnter={(e) => handleButtonHover(e, true)}
                        onMouseLeave={(e) => handleButtonHover(e, false)}
                    >
                        {showManagement ? 'मेनूवर परत जा' : 'मेनू व्यवस्थापन'}
                    </button>
                )}
            </div>

            {showManagement && user?.isAdmin ? (
                <MenuManagement onMenuUpdate={handleMenuUpdate} />
            ) : (
                <>
                    <FoodEntry key={menuKey} onFoodSelect={handleFoodSelect} />
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