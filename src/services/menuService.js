// Menu Service for managing hotel-specific menus
import { getCurrentHotelId } from './authService';

// Default menus for each hotel
const defaultMenus = {
    matoshree: {
        // Matoshree specializes in traditional Maharashtrian vegetarian food
        '101': { name: 'मातोश्री स्पेशल थाळी', rate: 250, category: 'स्पेशल थाळी' },
        '102': { name: 'महाराष्ट्रीयन थाळी', rate: 180, category: 'स्पेशल थाळी' },
        '103': { name: 'मिनी थाळी', rate: 120, category: 'स्पेशल थाळी' },
        
        // Traditional Snacks
        '201': { name: 'मातोश्री वडापाव', rate: 30, category: 'नाश्ता' },
        '202': { name: 'मिसळपाव स्पेशल', rate: 90, category: 'नाश्ता' },
        '203': { name: 'साबुदाणा वडा', rate: 60, category: 'नाश्ता' },
        '204': { name: 'भजिया प्लेट', rate: 80, category: 'नाश्ता' },
        '205': { name: 'कांदा भजी', rate: 70, category: 'नाश्ता' },
        
        // Rice Items
        '301': { name: 'वेज पुलाव', rate: 160, category: 'भात पदार्थ' },
        '302': { name: 'जिरा राइस', rate: 130, category: 'भात पदार्थ' },
        '303': { name: 'दही भात', rate: 100, category: 'भात पदार्थ' },
        '304': { name: 'साधा भात', rate: 80, category: 'भात पदार्थ' },
        
        // Rotis & Breads
        '401': { name: 'भाकरी', rate: 25, category: 'रोटी आणि ब्रेड' },
        '402': { name: 'चपाती', rate: 18, category: 'रोटी आणि ब्रेड' },
        '403': { name: 'ज्वारी भाकरी', rate: 30, category: 'रोटी आणि ब्रेड' },
        '404': { name: 'थालीपीठ', rate: 70, category: 'रोटी आणि ब्रेड' },
        
        // Curry & Sabji
        '501': { name: 'भरली वांगी', rate: 140, category: 'करी आणि सब्जी' },
        '502': { name: 'भेंडी मसाला', rate: 120, category: 'करी आणि सब्जी' },
        '503': { name: 'आलू गोबी', rate: 110, category: 'करी आणि सब्जी' },
        '504': { name: 'मटकी उसळ', rate: 100, category: 'करी आणि सब्जी' },
        '505': { name: 'आमटी (महाराष्ट्रीयन डाळ)', rate: 90, category: 'करी आणि सब्जी' },
        
        // Beverages
        '601': { name: 'सोल कढी', rate: 50, category: 'पेय पदार्थ' },
        '602': { name: 'ताक', rate: 35, category: 'पेय पदार्थ' },
        '603': { name: 'मसाला चहा', rate: 25, category: 'पेय पदार्थ' },
        '604': { name: 'फिल्टर कॉफी', rate: 30, category: 'पेय पदार्थ' },
        
        // Sweets
        '701': { name: 'पुरणपोळी', rate: 80, category: 'मिठाई' },
        '702': { name: 'मोदक', rate: 60, category: 'मिठाई' },
        '703': { name: 'श्रीखंड', rate: 90, category: 'मिठाई' },
        '704': { name: 'बासुंदी', rate: 85, category: 'मिठाई' }
    },
    
    maharashtra: {
        // Original Maharashtra Hotel menu (from previous implementation)
        '101': { name: 'वेज बिर्यानी', rate: 180, category: 'मुख्य जेवण' },
        '102': { name: 'चिकन बिर्यानी', rate: 220, category: 'मुख्य जेवण' },
        '103': { name: 'मटण बिर्यानी', rate: 280, category: 'मुख्य जेवण' },
        '201': { name: 'वडापाव', rate: 25, category: 'नाश्ता' },
        '202': { name: 'मिसळपाव', rate: 80, category: 'नाश्ता' },
        '301': { name: 'डाळ तडका', rate: 110, category: 'करी' },
        '302': { name: 'पनीर बटर मसाला', rate: 160, category: 'करी' },
        '303': { name: 'चिकन करी', rate: 180, category: 'करी' },
        '401': { name: 'रोटी', rate: 15, category: 'रोटी' },
        '402': { name: 'नान', rate: 35, category: 'रोटी' },
        '501': { name: 'मसाला चहा', rate: 20, category: 'पेय पदार्थ' },
        '502': { name: 'लस्सी', rate: 40, category: 'पेय पदार्थ' }
        // ... (can add more items as needed)
    }
};

// Get menu for current hotel
export const getHotelMenu = () => {
    const hotelId = getCurrentHotelId();
    if (!hotelId) return {};
    
    // Check if we need to force reset due to language change
    const languageVersion = localStorage.getItem(`menu_language_version_${hotelId}`);
    if (languageVersion !== 'marathi_v1') {
        // Reset to new Marathi menu
        localStorage.removeItem(`menu_${hotelId}`);
        localStorage.setItem(`menu_language_version_${hotelId}`, 'marathi_v1');
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