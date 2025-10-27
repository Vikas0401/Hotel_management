export const isPositiveNumber = (value) => {
    return typeof value === 'number' && value > 0;
};

export const validateFoodCode = (code) => {
    const validCodes = ['F001', 'F002', 'F003']; // Example food codes
    return validCodes.includes(code);
};

export const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};