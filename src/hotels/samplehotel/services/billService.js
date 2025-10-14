export const foodItems = {
    "F001": { name: "Pizza", price: 10 },
    "F002": { name: "Burger", price: 8 },
    "F003": { name: "Pasta", price: 12 },
    "F004": { name: "Salad", price: 7 },
};

export const calculateBill = (selectedItems) => {
    return selectedItems.reduce((total, item) => {
        const foodItem = foodItems[item.code];
        return total + (foodItem.price * item.quantity);
    }, 0);
};