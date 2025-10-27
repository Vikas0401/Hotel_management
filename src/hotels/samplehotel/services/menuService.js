// Menu Service for managing hotel-specific menus
import { getCurrentHotelId } from './authService';

// Default menus for each hotel
const defaultMenus = {
    matoshree: {
        // Vegetarian Items
        '101': { name: 'वेज बिर्यानी', rate: 180, category: 'शाकाहारी जेवण' },
        '102': { name: 'पनीर बटर मसाला', rate: 220, category: 'शाकाहारी जेवण' },
        '103': { name: 'डाळ तडका', rate: 150, category: 'शाकाहारी जेवण' },
        '104': { name: 'वेज थाळी', rate: 250, category: 'शाकाहारी जेवण' },
        
        // Non-Vegetarian Items  
        '201': { name: 'चिकन बिर्यानी', rate: 280, category: 'मांसाहारी जेवण' },
        '202': { name: 'मटण करी', rate: 350, category: 'मांसाहारी जेवण' },
        '203': { name: 'चिकन टिक्का', rate: 320, category: 'मांसाहारी जेवण' },
        '204': { name: 'फिश करी', rate: 300, category: 'मांसाहारी जेवण' }
    },
    
    maharashtra: {
        // Vegetarian Items
        '101': { name: 'वेज बिर्यानी', rate: 180, category: 'शाकाहारी जेवण' },
        '102': { name: 'पनीर बटर मसाला', rate: 200, category: 'शाकाहारी जेवण' },
        '103': { name: 'डाळ तडका', rate: 110, category: 'शाकाहारी जेवण' },
        '104': { name: 'वेज थाळी', rate: 220, category: 'शाकाहारी जेवण' },
        
        // Non-Vegetarian Items
        '201': { name: 'चिकन बिर्यानी', rate: 250, category: 'मांसाहारी जेवण' },
        '202': { name: 'मटण करी', rate: 320, category: 'मांसाहारी जेवण' },
        '203': { name: 'चिकन करी', rate: 180, category: 'मांसाहारी जेवण' },
        '204': { name: 'फिश फ्राय', rate: 280, category: 'मांसाहारी जेवण' }
    },
    
    samplehotel: {
        // Vegetarian Main Course
        '101': { name: 'Veg Biryani', rate: 160, category: 'Vegetarian Main Course' },
        '102': { name: 'Paneer Butter Masala', rate: 180, category: 'Vegetarian Main Course' },
        '103': { name: 'Dal Tadka', rate: 100, category: 'Vegetarian Main Course' },
        '104': { name: 'Veg Thali', rate: 200, category: 'Vegetarian Main Course' },
        '105': { name: 'Palak Paneer', rate: 170, category: 'Vegetarian Main Course' },
        '106': { name: 'Aloo Gobi', rate: 140, category: 'Vegetarian Main Course' },
        '107': { name: 'Chole Bhature', rate: 120, category: 'Vegetarian Main Course' },
        '108': { name: 'Rajma Rice', rate: 130, category: 'Vegetarian Main Course' },
        '109': { name: 'Veg Pulao', rate: 150, category: 'Vegetarian Main Course' },
        '110': { name: 'Mixed Veg Curry', rate: 140, category: 'Vegetarian Main Course' },
        
        // Non-Vegetarian Main Course
        '201': { name: 'Chicken Biryani', rate: 220, category: 'Non-Vegetarian Main Course' },
        '202': { name: 'Mutton Curry', rate: 280, category: 'Non-Vegetarian Main Course' },
        '203': { name: 'Chicken Tikka', rate: 250, category: 'Non-Vegetarian Main Course' },
        '204': { name: 'Fish Curry', rate: 240, category: 'Non-Vegetarian Main Course' },
        '205': { name: 'Chicken Curry', rate: 200, category: 'Non-Vegetarian Main Course' },
        '206': { name: 'Egg Curry', rate: 120, category: 'Non-Vegetarian Main Course' },
        '207': { name: 'Chicken Fried Rice', rate: 180, category: 'Non-Vegetarian Main Course' },
        '208': { name: 'Mutton Biryani', rate: 320, category: 'Non-Vegetarian Main Course' },
        '209': { name: 'Prawn Curry', rate: 260, category: 'Non-Vegetarian Main Course' },
        '210': { name: 'Chicken Masala', rate: 230, category: 'Non-Vegetarian Main Course' },
        
        // Appetizers & Snacks
        '301': { name: 'Samosa (2 pcs)', rate: 30, category: 'Appetizers & Snacks' },
        '302': { name: 'Pakora', rate: 60, category: 'Appetizers & Snacks' },
        '303': { name: 'Spring Rolls', rate: 80, category: 'Appetizers & Snacks' },
        '304': { name: 'Chicken Wings', rate: 150, category: 'Appetizers & Snacks' },
        '305': { name: 'Fish Fingers', rate: 120, category: 'Appetizers & Snacks' },
        '306': { name: 'Veg Cutlet', rate: 70, category: 'Appetizers & Snacks' },
        '307': { name: 'Chicken 65', rate: 180, category: 'Appetizers & Snacks' },
        '308': { name: 'Paneer Tikka', rate: 160, category: 'Appetizers & Snacks' },
        
        // Breads & Rice
        '401': { name: 'Roti (1 pc)', rate: 15, category: 'Breads & Rice' },
        '402': { name: 'Naan', rate: 25, category: 'Breads & Rice' },
        '403': { name: 'Butter Naan', rate: 35, category: 'Breads & Rice' },
        '404': { name: 'Garlic Naan', rate: 40, category: 'Breads & Rice' },
        '405': { name: 'Plain Rice', rate: 60, category: 'Breads & Rice' },
        '406': { name: 'Jeera Rice', rate: 80, category: 'Breads & Rice' },
        '407': { name: 'Paratha', rate: 30, category: 'Breads & Rice' },
        
        // Beverages
        '501': { name: 'Tea', rate: 20, category: 'Beverages' },
        '502': { name: 'Coffee', rate: 25, category: 'Beverages' },
        '503': { name: 'Fresh Lime Water', rate: 30, category: 'Beverages' },
        '504': { name: 'Lassi', rate: 50, category: 'Beverages' },
        '505': { name: 'Cold Drink', rate: 40, category: 'Beverages' },
        '506': { name: 'Fresh Juice', rate: 60, category: 'Beverages' },
        '507': { name: 'Buttermilk', rate: 35, category: 'Beverages' },
        '508': { name: 'Milkshake', rate: 80, category: 'Beverages' },
        
        // Desserts
        '601': { name: 'Gulab Jamun', rate: 50, category: 'Desserts' },
        '602': { name: 'Rasgulla', rate: 40, category: 'Desserts' },
        '603': { name: 'Ice Cream', rate: 60, category: 'Desserts' },
        '604': { name: 'Kheer', rate: 70, category: 'Desserts' },
        '605': { name: 'Kulfi', rate: 50, category: 'Desserts' },
        
        // Chinese
        '701': { name: 'Veg Noodles', rate: 120, category: 'Chinese' },
        '702': { name: 'Chicken Noodles', rate: 150, category: 'Chinese' },
        '703': { name: 'Veg Fried Rice', rate: 110, category: 'Chinese' },
        '704': { name: 'Chicken Fried Rice', rate: 140, category: 'Chinese' },
        '705': { name: 'Manchurian', rate: 130, category: 'Chinese' },
        '706': { name: 'Chili Chicken', rate: 180, category: 'Chinese' },
        
        // South Indian
        '801': { name: 'Dosa', rate: 80, category: 'South Indian' },
        '802': { name: 'Idli Sambhar', rate: 60, category: 'South Indian' },
        '803': { name: 'Uttapam', rate: 90, category: 'South Indian' },
        '804': { name: 'Medu Vada', rate: 50, category: 'South Indian' },
        '805': { name: 'Rava Dosa', rate: 100, category: 'South Indian' }
    }
};

// Get menu for current hotel
export const getHotelMenu = () => {
    const hotelId = getCurrentHotelId();
    if (!hotelId) return {};
    
    // Check if we need to force reset due to menu structure change
    const languageVersion = localStorage.getItem(`menu_language_version_${hotelId}`);
    if (languageVersion !== 'veg_nonveg_v1') {
        // Reset to new Veg/Non-Veg menu structure
        localStorage.removeItem(`menu_${hotelId}`);
        localStorage.setItem(`menu_language_version_${hotelId}`, 'veg_nonveg_v1');
    }
    
    // Check if custom menu exists in localStorage
    const customMenu = localStorage.getItem(`menu_${hotelId}`);
    if (customMenu) {
        return JSON.parse(customMenu);
    }
    
    // Return default menu
    return defaultMenus[hotelId] || {};
};

// Save custom menu for current hotel
export const saveHotelMenu = (menu) => {
    const hotelId = getCurrentHotelId();
    if (!hotelId) return false;
    
    localStorage.setItem(`menu_${hotelId}`, JSON.stringify(menu));
    return true;
};

// Add new menu item
export const addMenuItem = (code, item) => {
    const currentMenu = getHotelMenu();
    currentMenu[code] = item;
    return saveHotelMenu(currentMenu);
};

// Update existing menu item
export const updateMenuItem = (code, item) => {
    const currentMenu = getHotelMenu();
    if (currentMenu[code]) {
        currentMenu[code] = item;
        return saveHotelMenu(currentMenu);
    }
    return false;
};

// Delete menu item
export const deleteMenuItem = (code) => {
    const currentMenu = getHotelMenu();
    if (currentMenu[code]) {
        delete currentMenu[code];
        return saveHotelMenu(currentMenu);
    }
    return false;
};

// Reset to default menu
export const resetToDefaultMenu = () => {
    const hotelId = getCurrentHotelId();
    if (!hotelId) return false;
    
    localStorage.removeItem(`menu_${hotelId}`);
    return true;
};

// Get menu categories
export const getMenuCategories = () => {
    const menu = getHotelMenu();
    const categories = [...new Set(Object.values(menu).map(item => item.category))];
    return categories.sort();
};