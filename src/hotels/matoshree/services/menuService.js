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
    
    sample: {
        // Vegetarian Items
        '101': { name: 'Veg Biryani', rate: 160, category: 'Vegetarian' },
        '102': { name: 'Paneer Butter Masala', rate: 180, category: 'Vegetarian' },
        '103': { name: 'Dal Tadka', rate: 100, category: 'Vegetarian' },
        '104': { name: 'Veg Thali', rate: 200, category: 'Vegetarian' },
        
        // Non-Vegetarian Items
        '201': { name: 'Chicken Biryani', rate: 220, category: 'Non-Vegetarian' },
        '202': { name: 'Mutton Curry', rate: 280, category: 'Non-Vegetarian' },
        '203': { name: 'Chicken Tikka', rate: 250, category: 'Non-Vegetarian' },
        '204': { name: 'Fish Curry', rate: 240, category: 'Non-Vegetarian' }
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