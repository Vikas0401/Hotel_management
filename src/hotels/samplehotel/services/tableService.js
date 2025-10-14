// Table Management Service - Handles multiple table orders

const TABLE_ORDERS_KEY = 'tableOrders';
const ACTIVE_TABLES_KEY = 'activeTables';

// Initialize table orders structure
export const initializeTableOrders = () => {
    const existing = getTableOrders();
    if (!existing || Object.keys(existing).length === 0) {
        const initialTableOrders = {};
        localStorage.setItem(TABLE_ORDERS_KEY, JSON.stringify(initialTableOrders));
        return initialTableOrders;
    }
    return existing;
};

// Get all table orders
export const getTableOrders = () => {
    const tableOrders = localStorage.getItem(TABLE_ORDERS_KEY);
    return tableOrders ? JSON.parse(tableOrders) : {};
};

// Get orders for a specific table
export const getTableOrder = (tableNumber) => {
    const allOrders = getTableOrders();
    return allOrders[tableNumber] || {
        tableNumber,
        items: [],
        status: 'active',
        startTime: new Date().toISOString(),
        customerInfo: {
            name: '',
            phoneNumber: ''
        }
    };
};

// Add food item to a specific table
export const addFoodToTable = (tableNumber, foodItem) => {
    const allOrders = getTableOrders();
    
    if (!allOrders[tableNumber]) {
        allOrders[tableNumber] = {
            tableNumber,
            items: [],
            status: 'active',
            startTime: new Date().toISOString(),
            customerInfo: {
                name: '',
                phoneNumber: ''
            }
        };
    }

    // Check if the food item already exists in the table order
    const existingItemIndex = allOrders[tableNumber].items.findIndex(
        item => item.code === foodItem.code
    );

    if (existingItemIndex >= 0) {
        // If item exists, increase quantity
        allOrders[tableNumber].items[existingItemIndex].quantity += foodItem.quantity;
    } else {
        // If item doesn't exist, add new item
        allOrders[tableNumber].items.push({
            ...foodItem,
            addedAt: new Date().toISOString()
        });
    }

    localStorage.setItem(TABLE_ORDERS_KEY, JSON.stringify(allOrders));
    updateActiveTablesList();
    return allOrders[tableNumber];
};

// Remove food item from a specific table
export const removeFoodFromTable = (tableNumber, itemIndex) => {
    const allOrders = getTableOrders();
    
    if (allOrders[tableNumber] && allOrders[tableNumber].items[itemIndex]) {
        allOrders[tableNumber].items.splice(itemIndex, 1);
        
        // If no items left, remove the table order
        if (allOrders[tableNumber].items.length === 0) {
            delete allOrders[tableNumber];
        }
        
        localStorage.setItem(TABLE_ORDERS_KEY, JSON.stringify(allOrders));
        updateActiveTablesList();
        return allOrders[tableNumber] || null;
    }
    
    return null;
};

// Update quantity of a specific item in a table
export const updateFoodQuantityInTable = (tableNumber, itemIndex, newQuantity) => {
    const allOrders = getTableOrders();
    
    if (allOrders[tableNumber] && allOrders[tableNumber].items[itemIndex]) {
        if (newQuantity <= 0) {
            // If quantity is 0 or negative, remove the item
            return removeFoodFromTable(tableNumber, itemIndex);
        } else {
            allOrders[tableNumber].items[itemIndex].quantity = newQuantity;
            localStorage.setItem(TABLE_ORDERS_KEY, JSON.stringify(allOrders));
            return allOrders[tableNumber];
        }
    }
    
    return null;
};

// Update customer info for a table
export const updateTableCustomerInfo = (tableNumber, customerInfo) => {
    const allOrders = getTableOrders();
    
    if (allOrders[tableNumber]) {
        allOrders[tableNumber].customerInfo = {
            ...allOrders[tableNumber].customerInfo,
            ...customerInfo
        };
        localStorage.setItem(TABLE_ORDERS_KEY, JSON.stringify(allOrders));
        return allOrders[tableNumber];
    }
    
    return null;
};

// Get list of active tables
export const getActiveTables = () => {
    const tableOrders = getTableOrders();
    return Object.keys(tableOrders).filter(tableNumber => 
        tableOrders[tableNumber].status === 'active'
    ).sort((a, b) => {
        // Sort table numbers naturally (T1, T2, T10, etc.)
        const aNum = parseInt(a.replace(/[^0-9]/g, '')) || 0;
        const bNum = parseInt(b.replace(/[^0-9]/g, '')) || 0;
        return aNum - bNum;
    });
};

// Update active tables list in localStorage
const updateActiveTablesList = () => {
    const activeTables = getActiveTables();
    localStorage.setItem(ACTIVE_TABLES_KEY, JSON.stringify(activeTables));
};

// Complete/Close a table order (move to billing)
export const completeTableOrder = (tableNumber) => {
    const allOrders = getTableOrders();
    
    if (allOrders[tableNumber]) {
        // Mark as completed but don't delete yet
        allOrders[tableNumber].status = 'completed';
        allOrders[tableNumber].completedAt = new Date().toISOString();
        localStorage.setItem(TABLE_ORDERS_KEY, JSON.stringify(allOrders));
        updateActiveTablesList();
        
        // Return the completed order for billing
        return allOrders[tableNumber];
    }
    
    return null;
};

// Clear completed table order after billing
export const clearTableOrder = (tableNumber) => {
    const allOrders = getTableOrders();
    
    if (allOrders[tableNumber]) {
        delete allOrders[tableNumber];
        localStorage.setItem(TABLE_ORDERS_KEY, JSON.stringify(allOrders));
        updateActiveTablesList();
        return true;
    }
    
    return false;
};

// Calculate total amount for a table
export const calculateTableTotal = (tableNumber) => {
    const tableOrder = getTableOrder(tableNumber);
    return tableOrder.items.reduce((total, item) => {
        return total + (item.rate * item.quantity);
    }, 0);
};

// Get table order summary
export const getTableOrderSummary = (tableNumber) => {
    const tableOrder = getTableOrder(tableNumber);
    const total = calculateTableTotal(tableNumber);
    const itemCount = tableOrder.items.reduce((count, item) => count + item.quantity, 0);
    
    return {
        tableNumber,
        itemCount,
        total,
        status: tableOrder.status,
        startTime: tableOrder.startTime,
        customerInfo: tableOrder.customerInfo
    };
};

// Get all table summaries
export const getAllTableSummaries = () => {
    const activeTables = getActiveTables();
    return activeTables.map(tableNumber => getTableOrderSummary(tableNumber));
};

// Initialize on first load
initializeTableOrders();