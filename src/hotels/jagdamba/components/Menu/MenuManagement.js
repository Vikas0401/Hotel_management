import React, { useState, useEffect, useCallback } from 'react';
import { 
    getHotelMenu, 
    addMenuItem, 
    updateMenuItem, 
    deleteMenuItem, 
    resetToDefaultMenu,
    getMenuCategories 
} from '../../services/menuService';
import { getCurrentUser } from '../../services/authService';

const MenuManagement = ({ onMenuUpdate }) => {
    const [menu, setMenu] = useState({});
    const [categories, setCategories] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newItem, setNewItem] = useState({
        code: '',
        name: '',
        rate: '',
        category: ''
    });
    const [user, setUser] = useState(null);

    const loadMenu = useCallback(() => {
        const currentMenu = getHotelMenu();
        setMenu(currentMenu);
        setCategories(getMenuCategories());
        if (onMenuUpdate) {
            onMenuUpdate(currentMenu);
        }
    }, [onMenuUpdate]);

    useEffect(() => {
        loadMenu();
        setUser(getCurrentUser());
    }, [loadMenu]);

    const handleAddItem = () => {
        if (newItem.code && newItem.name && newItem.rate && newItem.category) {
            const success = addMenuItem(newItem.code, {
                name: newItem.name,
                rate: parseFloat(newItem.rate),
                category: newItem.category
            });
            
            if (success) {
                setNewItem({ code: '', name: '', rate: '', category: '' });
                setShowAddForm(false);
                loadMenu();
            }
        }
    };

    const handleUpdateItem = () => {
        if (editingItem) {
            const success = updateMenuItem(editingItem.code, {
                name: editingItem.name,
                rate: parseFloat(editingItem.rate),
                category: editingItem.category
            });
            
            if (success) {
                setEditingItem(null);
                loadMenu();
            }
        }
    };

    const handleDeleteItem = (code) => {
        if (window.confirm('तुम्हाला खात्री आहे की तुम्ही हा आयटम हटवू इच्छिता?')) {
            const success = deleteMenuItem(code);
            if (success) {
                loadMenu();
            }
        }
    };

    const handleResetMenu = () => {
        if (window.confirm('तुम्हाला खात्री आहे की तुम्ही डिफॉल्ट मेनूवर रीसेट करू इच्छिता? यामुळे सर्व कस्टम बदल काढले जातील.')) {
            const success = resetToDefaultMenu();
            if (success) {
                loadMenu();
            }
        }
    };

    const groupedMenu = {};
    Object.entries(menu).forEach(([code, item]) => {
        if (!groupedMenu[item.category]) {
            groupedMenu[item.category] = [];
        }
        groupedMenu[item.category].push({ code, ...item });
    });

    return (
        <div className="menu-management">
            <div className="management-header">
                <h2><span className={user?.hotelId === 'matoshree' ? 'hotel-matoshree-name' : ''}>{user?.hotelName}</span> - मेनू व्यवस्थापन</h2>
                <div className="management-actions">
                    <button 
                        onClick={() => setShowAddForm(true)} 
                        className="add-item-btn"
                    >
                        नवीन आयटम जोडा
                    </button>
                    <button 
                        onClick={handleResetMenu} 
                        className="reset-menu-btn"
                    >
                        डिफॉल्टवर रीसेट करा
                    </button>
                </div>
            </div>

            {/* Add New Item Form */}
            {showAddForm && (
                <div className="add-item-form">
                    <h3>नवीन मेनू आयटम जोडा</h3>
                    <div className="form-grid">
                        <input
                            type="text"
                            placeholder="आयटम कोड (उदा., 801)"
                            value={newItem.code}
                            onChange={(e) => setNewItem({...newItem, code: e.target.value})}
                        />
                        <input
                            type="text"
                            placeholder="आयटमचे नाव"
                            value={newItem.name}
                            onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                        />
                        <input
                            type="number"
                            placeholder="दर (₹)"
                            value={newItem.rate}
                            onChange={(e) => setNewItem({...newItem, rate: e.target.value})}
                        />
                        <select
                            value={newItem.category}
                            onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                        >
                            <option value="">श्रेणी निवडा</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                            <option value="NEW_CATEGORY">नवीन श्रेणी जोडा</option>
                        </select>
                        {newItem.category === 'NEW_CATEGORY' && (
                            <input
                                type="text"
                                placeholder="नवीन श्रेणीचे नाव"
                                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                            />
                        )}
                    </div>
                    <div className="form-actions">
                        <button onClick={handleAddItem} className="save-btn">आयटम सेव्ह करा</button>
                        <button onClick={() => setShowAddForm(false)} className="cancel-btn">रद्द करा</button>
                    </div>
                </div>
            )}

            {/* Menu Items by Category */}
            <div className="menu-categories">
                {Object.entries(groupedMenu).map(([category, items]) => (
                    <div key={category} className="category-section">
                        <h3 className="category-title">{category}</h3>
                        <div className="menu-items">
                            {items.map((item) => (
                                <div key={item.code} className="menu-item-card">
                                    {editingItem?.code === item.code ? (
                                        <div className="edit-form">
                                            <input
                                                type="text"
                                                value={editingItem.name}
                                                onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                                            />
                                            <input
                                                type="number"
                                                value={editingItem.rate}
                                                onChange={(e) => setEditingItem({...editingItem, rate: e.target.value})}
                                            />
                                            <select
                                                value={editingItem.category}
                                                onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                                            >
                                                {categories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                            <div className="edit-actions">
                                                <button onClick={handleUpdateItem} className="save-btn">सेव्ह करा</button>
                                                <button onClick={() => setEditingItem(null)} className="cancel-btn">रद्द करा</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="item-display">
                                            <div className="item-info">
                                                <span className="item-code">{item.code}</span>
                                                <span className="item-name">{item.name}</span>
                                                <span className="item-rate">₹{item.rate}</span>
                                            </div>
                                            <div className="item-actions">
                                                <button 
                                                    onClick={() => setEditingItem(item)} 
                                                    className="edit-btn"
                                                >
                                                    संपादित करा
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteItem(item.code)} 
                                                    className="delete-btn"
                                                >
                                                    हटवा
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuManagement;