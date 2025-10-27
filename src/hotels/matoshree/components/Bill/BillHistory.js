import React, { useState, useEffect, useCallback } from 'react';
import { getBillHistory, filterBills, deleteBillFromHistory, getBillStatistics, exportBillHistoryToPDF, exportSingleBillToPDF, printSingleBill, updateBillPayment } from '../../services/billHistoryService';
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

    const applyFilters = useCallback(() => {
        const filtered = filterBills(filters.customerName, filters.startDate, filters.endDate);
        setFilteredBills(filtered);
    }, [filters]);

    useEffect(() => {
        applyFilters();
    }, [bills, filters, applyFilters]);

    const loadBills = () => {
        console.log('Loading bills...');
        const billHistory = getBillHistory();
        console.log('Retrieved bill history:', billHistory);
        console.log('Number of bills:', billHistory.length);
        setBills(billHistory);
    };

    const loadStatistics = () => {
        const stats = getBillStatistics();
        setStatistics(stats);
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
        try {
            const doc = exportBillHistoryToPDF();
            
            // Get hotel name in English for filename
            const getHotelNameForFile = (user) => {
                if (!user) return 'Hotel';
                switch (user.hotelId) {
                    case 'matoshree':
                        return 'Hotel_Matoshree';
                    case 'jagdamba':
                        return 'Hotel_Jagdamba';
                    case 'samplehotel':
                        return 'Sample_Hotel';
                    default:
                        return 'Hotel';
                }
            };
            
            const fileName = `${getHotelNameForFile(user)}_bill_history_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);
            
            // Show success message
            alert('बिल इतिहास PDF मध्ये डाउनलोड झाला!');
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('PDF बनवताना त्रुटी झाली. कृपया पुन्हा प्रयत्न करा.');
        }
    };

    const handleExportSingleBill = (bill) => {
        try {
            const doc = exportSingleBillToPDF(bill);
            
            // Get hotel name in English for filename
            const getHotelNameForFile = (user) => {
                if (!user) return 'Hotel';
                switch (user.hotelId) {
                    case 'matoshree':
                        return 'Hotel_Matoshree';
                    case 'jagdamba':
                        return 'Hotel_Jagdamba';
                    case 'samplehotel':
                        return 'Sample_Hotel';
                    default:
                        return 'Hotel';
                }
            };
            
            const fileName = `${getHotelNameForFile(user)}_bill_${bill.billNumber}_${bill.date.replace(/\//g, '-')}.pdf`;
            doc.save(fileName);
            
            // Show success message
            alert('बिल PDF मध्ये डाउनलोड झाले!');
        } catch (error) {
            console.error('Error generating single bill PDF:', error);
            alert('PDF बनवताना त्रुटी झाली. कृपया पुन्हा प्रयत्न करा.');
        }
    };

    const handlePrintSingleBill = (bill) => {
        try {
            printSingleBill(bill);
        } catch (error) {
            console.error('Error printing bill:', error);
            alert('प्रिंट करताना त्रुटी झाली. कृपया पुन्हा प्रयत्न करा.');
        }
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
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', paddingTop: '40px' }}>
            {/* Header */}
            <div style={{ marginBottom: '30px', marginTop: '20px' }}>
                <h1 style={{ 
                    color: 'var(--color-primary)',
                    textAlign: 'center',
                    marginBottom: '20px'
                }} className={user?.hotelId === 'matoshree' ? 'marathi-title themed-title' : 'themed-title'}>
                    बिल इतिहास
                </h1>

                {/* Statistics */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '15px', 
                    marginBottom: '20px',
                    marginTop: '30px'
                }}>
                    <div className="card" style={{ 
                        padding: '15px', 
                        textAlign: 'center'
                    }}>
                        <h3 style={{ color: 'var(--color-info)', margin: '0 0 10px 0' }}>एकूण बिल</h3>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{statistics.totalBills}</p>
                    </div>
                    <div className="card" style={{ 
                        padding: '15px', 
                        textAlign: 'center'
                    }}>
                        <h3 style={{ color: 'var(--color-success)', margin: '0 0 10px 0' }}>एकूण कमाई</h3>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{formatCurrency(statistics.totalRevenue || 0)}</p>
                    </div>
                    <div className="card" style={{ 
                        padding: '15px', 
                        textAlign: 'center'
                    }}>
                        <h3 style={{ color: 'var(--color-warning)', margin: '0 0 10px 0' }}>आजचे बिल</h3>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{statistics.todaysBills}</p>
                    </div>
                    <div className="card" style={{ 
                        padding: '15px', 
                        textAlign: 'center'
                    }}>
                        <h3 style={{ color: 'var(--color-danger)', margin: '0 0 10px 0' }}>आजची कमाई</h3>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{formatCurrency(statistics.todaysRevenue || 0)}</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="card" style={{ 
                padding: '20px', 
                marginBottom: '20px'
            }}>
                <h3 style={{ 
                    color: 'var(--color-primary)', 
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
                        <button className="btn btn-secondary"
                            onClick={clearFilters}
                        >
                            फिल्टर साफ करा
                        </button>
                        <button className="btn btn-primary"
                            onClick={handleExportHistory}
                        >
                            📄 PDF एक्सपोर्ट करा
                        </button>
                    </div>
                </div>
            </div>

            {/* Bills List */}
            <div className="card" style={{ 
                overflow: 'hidden'
            }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
                    <h3 style={{ 
                        color: 'var(--color-primary)', 
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
                                <tr>
                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid var(--color-border)' }}>बिल नं.</th>
                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid var(--color-border)' }}>तारीख</th>
                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid var(--color-border)' }}>ग्राहक</th>
                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid var(--color-border)' }}>ऑर्डर प्रकार</th>
                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid var(--color-border)' }}>टेबल</th>
                                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid var(--color-border)' }}>रक्कम</th>
                                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid var(--color-border)' }}>जमा</th>
                                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid var(--color-border)' }}>बाकी</th>
                                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid var(--color-border)' }}>कृती</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBills.map((bill, index) => (
                                    <tr key={bill.id} style={{ 
                                        borderBottom: '1px solid var(--color-border)'
                                    }}>
                                        <td style={{ padding: '12px' }}>{bill.billNumber}</td>
                                        <td style={{ padding: '12px' }}>{bill.date}</td>
                                        <td style={{ padding: '12px' }}>{bill.customerInfo?.name || '-'}</td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            {bill.customerInfo?.tableNumber && bill.customerInfo.tableNumber !== '-' ? 
                                                <span style={{ color: 'var(--color-info)', fontSize: '16px' }}>🍽️ टेबल</span> : 
                                                <span style={{ color: 'var(--color-warning)', fontSize: '16px' }}>🛍️ पार्सल</span>
                                            }
                                        </td>
                                        <td style={{ padding: '12px' }}>{bill.customerInfo?.tableNumber || '-'}</td>
                                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(bill.total)}</td>
                                        <td style={{ padding: '12px', textAlign: 'right' }}>{formatCurrency(bill.paymentInfo?.jama || 0)}</td>
                                        <td style={{ 
                                            padding: '12px', 
                                            textAlign: 'right', 
                                            color: (bill.paymentInfo?.baki || bill.total) > 0 ? 'var(--color-danger)' : 'var(--color-success)',
                                            fontWeight: 'bold'
                                        }}>
                                            {formatCurrency(bill.paymentInfo?.baki || bill.total)}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <button className="btn btn-info"
                                                onClick={() => setSelectedBill(bill)}
                                            >
                                                पहा
                                            </button>
                                            <button className="btn btn-success"
                                                onClick={() => handlePrintSingleBill(bill)}
                                            >
                                                🖨️ प्रिंट
                                            </button>
                                            <button className="btn btn-danger"
                                                onClick={() => handleDeleteBill(bill.id)}
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
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <button
                                    onClick={() => handleExportSingleBill(selectedBill)}
                                    style={{
                                        padding: '6px 12px',
                                        background: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px'
                                    }}
                                >
                                    📄 PDF डाउनलोड
                                </button>
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
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <strong>ग्राहक माहिती:</strong>
                            <p>नाव: {selectedBill.customerInfo?.name || '-'}</p>
                            <p>ऑर्डर प्रकार: {selectedBill.customerInfo?.tableNumber && selectedBill.customerInfo.tableNumber !== '-' ? 
                                <span style={{ color: '#3498db' }}>🍽️ टेबल ऑर्डर</span> : 
                                <span style={{ color: '#e67e22' }}>🛍️ पार्सल ऑर्डर</span>
                            }</p>
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
                                <tr style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-accent))', color: 'white' }}>
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
