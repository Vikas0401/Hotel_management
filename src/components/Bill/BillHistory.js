import React, { useState, useEffect } from 'react';
import { getBillHistory, filterBills, deleteBillFromHistory, getBillStatistics, exportBillHistory, updateBillPayment } from '../../services/billHistoryService';
import { getCurrentUser } from '../../services/authService';

const BillHistory = () => {
    const [bills, setBills] = useState([]);
    const [filteredBills, setFilteredBills] = useState([]);
    const [user, setUser] = useState(null);
    const [statistics, setStatistics] = useState({});
    const [filters, setFilters] = useState({
        customerName: '',
        startDate: '',
        endDate: ''
    });
    const [selectedBill, setSelectedBill] = useState(null);
    const [editingPayment, setEditingPayment] = useState(false);
    const [editPaymentData, setEditPaymentData] = useState({
        jama: 0,
        baki: 0
    });

    useEffect(() => {
        setUser(getCurrentUser());
        loadBills();
        loadStatistics();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [bills, filters]);

    const loadBills = () => {
        const billHistory = getBillHistory();
        setBills(billHistory);
    };

    const loadStatistics = () => {
        const stats = getBillStatistics();
        setStatistics(stats);
    };

    const applyFilters = () => {
        const filtered = filterBills(filters);
        setFilteredBills(filtered);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            customerName: '',
            startDate: '',
            endDate: ''
        });
    };

    const handleDeleteBill = (billId) => {
        if (window.confirm('तुम्हाला खात्री आहे की तुम्ही हे बिल हटवू इच्छिता?')) {
            deleteBillFromHistory(billId);
            loadBills();
            loadStatistics();
            setSelectedBill(null);
        }
    };

    const handleExportHistory = () => {
        const exportData = exportBillHistory();
        const blob = new Blob([exportData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${user?.hotelName}_bill_history_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const formatCurrency = (amount) => {
        return `₹${amount.toFixed(2)}`;
    };

    const handleEditPayment = (bill) => {
        setEditingPayment(true);
        setEditPaymentData({
            jama: bill.paymentInfo?.jama || 0,
            baki: bill.paymentInfo?.baki || bill.total
        });
    };

    const handlePaymentDataChange = (e) => {
        const { name, value } = e.target;
        const numValue = parseFloat(value) || 0;
        
        if (name === 'jama') {
            const newBaki = Math.max(0, selectedBill.total - numValue);
            setEditPaymentData({
                jama: numValue,
                baki: newBaki
            });
        }
    };

    const handleSavePayment = () => {
        if (selectedBill) {
            const success = updateBillPayment(selectedBill.id, editPaymentData);
            if (success) {
                // Update the selected bill with new payment info
                setSelectedBill({
                    ...selectedBill,
                    paymentInfo: editPaymentData
                });
                
                // Reload bills to reflect changes in the table
                loadBills();
                setEditingPayment(false);
                alert('पेमेंट माहिती यशस्वीरित्या अपडेट झाली!');
            } else {
                alert('पेमेंट माहिती अपडेट करताना त्रुटी झाली!');
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingPayment(false);
        setEditPaymentData({ jama: 0, baki: 0 });
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ 
                    color: user?.hotelId === 'matoshree' ? '#C41E3A' : '#2c3e50',
                    textAlign: 'center',
                    marginBottom: '20px'
                }} className={user?.hotelId === 'matoshree' ? 'marathi-title' : ''}>
                    बिल इतिहास
                </h1>

                {/* Statistics */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '15px', 
                    marginBottom: '20px' 
                }}>
                    <div className={user?.hotelId === 'matoshree' ? 'card' : ''} style={{ 
                        padding: '15px', 
                        background: 'white', 
                        borderRadius: '8px', 
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ color: '#007bff', margin: '0 0 10px 0' }}>एकूण बिल</h3>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{statistics.totalBills}</p>
                    </div>
                    <div className={user?.hotelId === 'matoshree' ? 'card' : ''} style={{ 
                        padding: '15px', 
                        background: 'white', 
                        borderRadius: '8px', 
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ color: '#28a745', margin: '0 0 10px 0' }}>एकूण कमाई</h3>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{formatCurrency(statistics.totalRevenue || 0)}</p>
                    </div>
                    <div className={user?.hotelId === 'matoshree' ? 'card' : ''} style={{ 
                        padding: '15px', 
                        background: 'white', 
                        borderRadius: '8px', 
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ color: '#ffc107', margin: '0 0 10px 0' }}>आजचे बिल</h3>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{statistics.todaysBills}</p>
                    </div>
                    <div className={user?.hotelId === 'matoshree' ? 'card' : ''} style={{ 
                        padding: '15px', 
                        background: 'white', 
                        borderRadius: '8px', 
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ color: '#dc3545', margin: '0 0 10px 0' }}>आजची कमाई</h3>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{formatCurrency(statistics.todaysRevenue || 0)}</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className={user?.hotelId === 'matoshree' ? 'card' : ''} style={{ 
                padding: '20px', 
                background: 'white', 
                borderRadius: '8px', 
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                marginBottom: '20px'
            }}>
                <h3 style={{ 
                    color: user?.hotelId === 'matoshree' ? '#C41E3A' : '#2c3e50', 
                    marginBottom: '15px' 
                }} className={user?.hotelId === 'matoshree' ? 'marathi-header' : ''}>
                    फिल्टर
                </h3>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '15px', 
                    alignItems: 'end' 
                }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                            ग्राहकाचे नाव
                        </label>
                        <input
                            type="text"
                            name="customerName"
                            value={filters.customerName}
                            onChange={handleFilterChange}
                            placeholder="ग्राहकाचे नाव शोधा"
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                            सुरुवातीची तारीख
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                            अंतिम तारीख
                        </label>
                        <input
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={clearFilters}
                            style={{
                                padding: '8px 16px',
                                background: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            फिल्टर साफ करा
                        </button>
                        <button
                            onClick={handleExportHistory}
                            style={{
                                padding: '8px 16px',
                                background: user?.hotelId === 'matoshree' ? '#C41E3A' : '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            एक्सपोर्ट करा
                        </button>
                    </div>
                </div>
            </div>

            {/* Bills List */}
            <div className={user?.hotelId === 'matoshree' ? 'card' : ''} style={{ 
                background: 'white', 
                borderRadius: '8px', 
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
                    <h3 style={{ 
                        color: user?.hotelId === 'matoshree' ? '#C41E3A' : '#2c3e50', 
                        margin: '0' 
                    }} className={user?.hotelId === 'matoshree' ? 'marathi-header' : ''}>
                        बिल यादी ({filteredBills.length})
                    </h3>
                </div>

                {filteredBills.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                        <p>कोणतेही बिल सापडले नाहीत</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ 
                            width: '100%', 
                            borderCollapse: 'collapse',
                            fontSize: '14px'
                        }}>
                            <thead>
                                <tr style={{ background: '#f8f9fa' }}>
                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>बिल नं.</th>
                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>तारीख</th>
                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>ग्राहक</th>
                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>टेबल</th>
                                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>रक्कम</th>
                                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>जमा</th>
                                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>बाकी</th>
                                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>कृती</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBills.map((bill, index) => (
                                    <tr key={bill.id} style={{ 
                                        borderBottom: '1px solid #eee',
                                        background: index % 2 === 0 ? 'white' : '#f8f9fa'
                                    }}>
                                        <td style={{ padding: '12px' }}>{bill.billNumber}</td>
                                        <td style={{ padding: '12px' }}>{bill.date}</td>
                                        <td style={{ padding: '12px' }}>{bill.customerInfo?.name || '-'}</td>
                                        <td style={{ padding: '12px' }}>{bill.customerInfo?.tableNumber || '-'}</td>
                                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(bill.total)}</td>
                                        <td style={{ padding: '12px', textAlign: 'right' }}>{formatCurrency(bill.paymentInfo?.jama || 0)}</td>
                                        <td style={{ 
                                            padding: '12px', 
                                            textAlign: 'right', 
                                            color: (bill.paymentInfo?.baki || bill.total) > 0 ? '#dc3545' : '#28a745',
                                            fontWeight: 'bold'
                                        }}>
                                            {formatCurrency(bill.paymentInfo?.baki || bill.total)}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <button
                                                onClick={() => setSelectedBill(bill)}
                                                style={{
                                                    padding: '4px 8px',
                                                    background: '#007bff',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '3px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px',
                                                    marginRight: '5px'
                                                }}
                                            >
                                                पहा
                                            </button>
                                            <button
                                                onClick={() => handleDeleteBill(bill.id)}
                                                style={{
                                                    padding: '4px 8px',
                                                    background: '#dc3545',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '3px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                हटवा
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Bill Detail Modal */}
            {selectedBill && (
                <div style={{
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        maxWidth: '600px',
                        maxHeight: '80vh',
                        overflow: 'auto',
                        width: '90%'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: '0', color: user?.hotelId === 'matoshree' ? '#C41E3A' : '#2c3e50' }}>
                                बिल तपशील - {selectedBill.billNumber}
                            </h3>
                            <button
                                onClick={() => {
                                    setSelectedBill(null);
                                    setEditingPayment(false);
                                    setEditPaymentData({ jama: 0, baki: 0 });
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#666'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <strong>ग्राहक माहिती:</strong>
                            <p>नाव: {selectedBill.customerInfo?.name || '-'}</p>
                            <p>टेबल: {selectedBill.customerInfo?.tableNumber || '-'}</p>
                            <p>मोबाइल: {selectedBill.customerInfo?.phoneNumber || '-'}</p>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <strong>बिल माहिती:</strong>
                            <p>तारीख: {selectedBill.date}</p>
                            <p>वेळ: {selectedBill.time}</p>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px' }}>
                            <thead>
                                <tr style={{ background: '#f8f9fa' }}>
                                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>आयटम</th>
                                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>दर</th>
                                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>संख्या</th>
                                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>रक्कम</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedBill.items.map((item, index) => (
                                    <tr key={index}>
                                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.name}</td>
                                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>₹{item.rate}</td>
                                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.quantity}</td>
                                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>₹{(item.rate * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div style={{ textAlign: 'right' }}>
                            <p><strong>उपजोड: {formatCurrency(selectedBill.subtotal)}</strong></p>
                            <p><strong>जीएसटी (18%): {formatCurrency(selectedBill.tax)}</strong></p>
                            <p style={{ fontSize: '18px', color: user?.hotelId === 'matoshree' ? '#C41E3A' : '#007bff' }}>
                                <strong>एकूण: {formatCurrency(selectedBill.total)}</strong>
                            </p>
                            
                            {/* Payment Information */}
                            <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #ddd' }}>
                                {editingPayment ? (
                                    /* Edit Mode */
                                    <div style={{ textAlign: 'left' }}>
                                        <h4 style={{ marginBottom: '15px', color: '#2c3e50' }}>पेमेंट माहिती संपादित करा</h4>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                                जमा (Received Amount): ₹
                                            </label>
                                            <input
                                                type="number"
                                                name="jama"
                                                value={editPaymentData.jama}
                                                onChange={handlePaymentDataChange}
                                                min="0"
                                                step="0.01"
                                                style={{
                                                    padding: '8px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    width: '150px',
                                                    fontSize: '14px'
                                                }}
                                            />
                                        </div>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                                बाकी (Balance): ₹
                                            </label>
                                            <div style={{
                                                padding: '8px',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                backgroundColor: '#f8f9fa',
                                                width: '150px',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                color: editPaymentData.baki > 0 ? '#dc3545' : '#28a745'
                                            }}>
                                                {editPaymentData.baki.toFixed(2)}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={handleSavePayment}
                                                style={{
                                                    padding: '8px 16px',
                                                    background: '#28a745',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                सेव्ह करा
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                style={{
                                                    padding: '8px 16px',
                                                    background: '#6c757d',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                रद्द करा
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* View Mode */
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <p><strong>जमा (Received): {formatCurrency(selectedBill.paymentInfo?.jama || 0)}</strong></p>
                                            <button
                                                onClick={() => handleEditPayment(selectedBill)}
                                                style={{
                                                    padding: '4px 8px',
                                                    background: '#007bff',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '3px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                संपादित करा
                                            </button>
                                        </div>
                                        <p style={{ 
                                            color: (selectedBill.paymentInfo?.baki || selectedBill.total) > 0 ? '#dc3545' : '#28a745',
                                            fontSize: '16px'
                                        }}>
                                            <strong>बाकी (Balance): {formatCurrency(selectedBill.paymentInfo?.baki || selectedBill.total)}</strong>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillHistory;