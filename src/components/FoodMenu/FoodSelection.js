import React from 'react';

const FoodSelection = ({ selectedFoods, onRemoveFood }) => {
    const calculateAmount = (rate, quantity) => {
        return rate * quantity;
    };

    const calculateTotal = () => {
        return selectedFoods.reduce((total, food) => total + calculateAmount(food.rate, food.quantity), 0);
    };

    return (
        <div className="food-selection-container">
            <h2>Selected Food Items</h2>
            {selectedFoods.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666', fontSize: '1.1rem', padding: '20px' }}>
                    No items selected. Please add items from the menu above.
                </p>
            ) : (
                <>
                    <table className="food-selection-table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Food Item</th>
                                <th>Rate (₹)</th>
                                <th>Quantity</th>
                                <th>Amount (₹)</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedFoods.map((food, index) => (
                                <tr key={index}>
                                    <td>{food.code}</td>
                                    <td>{food.name}</td>
                                    <td>₹{food.rate}</td>
                                    <td>{food.quantity}</td>
                                    <td>₹{calculateAmount(food.rate, food.quantity)}</td>
                                    <td>
                                        <button 
                                            className="remove-button"
                                            onClick={() => onRemoveFood(index)}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="total-amount">
                        Total Amount: ₹{calculateTotal()}
                    </div>
                </>
            )}
        </div>
    );
};

export default FoodSelection;