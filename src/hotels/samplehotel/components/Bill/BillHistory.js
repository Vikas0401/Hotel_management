 import React, { useState, useEffect } from 'react';

// Mock data for demonstration
const mockBillHistory = [
    {
        id: '1',
        billNumber: 'B123456',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        customerInfo: { name: 'Demo Customer 1', tableNumber: 'T1', phoneNumber: '9876543210' },
        items: [
            { name: 'Sample Special Thali', rate: 250, quantity: 1 },
            { name: 'Vada Pav', rate: 30, quantity: 2 },
        ],
        subtotal: 310,
        tax: 0,
        total: 310,
        paymentInfo: { jama: 310, baki: 0 },
    },
    {
        id: '2',
        billNumber: 'B123457',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        customerInfo: { name: 'Demo Customer 2', tableNumber: '-', phoneNumber: '9876543211' },
        items: [
            { name: 'Chicken Biryani', rate: 350, quantity: 1 },
        ],
        subtotal: 350,
        tax: 63,
        total: 413,
        paymentInfo: { jama: 413, baki: 0 },
    },
];

const mockStatistics = {
    totalBills: 2,
    totalRevenue: 723,
    todaysBills: 2,
    todaysRevenue: 723,
};

const BillHistory = () => {
    const [bills] = useState(mockBillHistory);
    const [filteredBills, setFilteredBills] = useState(mockBillHistory);
    const [statistics] = useState(mockStatistics);
    const [filters, setFilters] = useState({
        customerName: '',
        startDate: '',
        endDate: ''
    });
    const [selectedBill, setSelectedBill] = useState(null);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        const { customerName, startDate, endDate } = filters;
        let result = bills;
        if (customerName) {
            result = result.filter(bill => bill.customerInfo.name.toLowerCase().includes(customerName.toLowerCase()));
        }
        if (startDate) {
            result = result.filter(bill => new Date(bill.date) >= new Date(startDate));
        }
        if (endDate) {
            result = result.filter(bill => new Date(bill.date) <= new Date(endDate));
        }
        setFilteredBills(result);
    }, [filters, bills]);

    const clearFilters = () => {
        setFilters({ customerName: '', startDate: '', endDate: '' });
    };

    const handleDeleteBill = () => {
        alert('This is a sample bill and cannot be deleted.');
    };

    const handleExportHistory = () => {
        alert('This is a sample history and cannot be exported.');
    };

    const handleExportSingleBill = () => {
        alert('This is a sample bill and cannot be exported.');
    };

    const handlePrintSingleBill = () => {
        alert('This is a sample bill and cannot be printed.');
    };

    const formatCurrency = (amount) => {
        return `₹${(amount || 0).toFixed(2)}`;
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', paddingTop: '40px' }}>
            <div style={{ marginBottom: '30px', marginTop: '20px' }}>
                <h1 style={{ color: '#2c3e50', textAlign: 'center', marginBottom: '20px' }}>
                    बिल इतिहास
                </h1>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '15px', 
                    marginBottom: '20px',
                    marginTop: '30px'
                }}>
                    <div style={{ padding: '15px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                        <h3 style={{ color: '#007bff', margin: '0 0 10px 0' }}>एकूण बिल</h3>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{statistics.totalBills}</p>
                    </div>
                    <div style={{ padding: '15px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                        <h3 style={{ color: '#28a745', margin: '0 0 10px 0' }}>एकूण कमाई</h3>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{formatCurrency(statistics.totalRevenue)}</p>
                    </div>
                    <div style={{ padding: '15px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                        <h3 style={{ color: '#ffc107', margin: '0 0 10px 0' }}>आजचे बिल</h3>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{statistics.todaysBills}</p>
                    </div>
                    <div style={{ padding: '15px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                        <h3 style={{ color: '#dc3545', margin: '0 0 10px 0' }}>आजची कमाई</h3>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{formatCurrency(statistics.todaysRevenue)}</p>
                    </div>
                </div>
            </div>

            <div style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
                <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>
                    फिल्टर
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', alignItems: 'end' }}>
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
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
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
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
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
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={clearFilters} style={{ padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                            फिल्टर साफ करा
                        </button>
                        <button onClick={handleExportHistory} style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                            📄 PDF एक्सपोर्ट करा
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
                    <h3 style={{ color: '#2c3e50', margin: '0' }}>
                        बिल यादी ({filteredBills.length})
                    </h3>
                </div>

                {filteredBills.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                        <p>कोणतेही बिल सापडले नाहीत</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                            <thead>
                                <tr style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-accent))', color: 'white' }}>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>बिल नं.</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>तारीख</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>ग्राहक</th>
                                    <th style={{ padding: '12px', textAlign: 'center' }}>ऑर्डर प्रकार</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>टेबल</th>
                                    <th style={{ padding: '12px', textAlign: 'right' }}>रक्कम</th>
                                    <th style={{ padding: '12px', textAlign: 'center' }}>कृती</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBills.map((bill, index) => (
                                    <tr key={bill.id} style={{ borderBottom: '1px solid #eee', background: index % 2 === 0 ? 'white' : '#f8f9fa' }}>
                                        <td style={{ padding: '12px' }}>{bill.billNumber}</td>
                                        <td style={{ padding: '12px' }}>{bill.date}</td>
                                        <td style={{ padding: '12px' }}>{bill.customerInfo?.name || '-'}</td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            {bill.customerInfo?.tableNumber && bill.customerInfo.tableNumber !== '-' ? 
                                                <span style={{ color: '#3498db', fontSize: '16px' }}>🍽️ टेबल</span> : 
                                                <span style={{ color: '#e67e22', fontSize: '16px' }}>🛍️ पार्सल</span>
                                            }
                                        </td>
                                        <td style={{ padding: '12px' }}>{bill.customerInfo?.tableNumber || '-'}</td>
                                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(bill.total)}</td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <button onClick={() => setSelectedBill(bill)} style={{ padding: '4px 8px', background: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px', marginRight: '3px', marginBottom: '3px' }}>
                                                पहा
                                            </button>
                                            <button onClick={handlePrintSingleBill} style={{ padding: '4px 8px', background: '#28a745', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px', marginRight: '3px', marginBottom: '3px' }}>
                                                🖨️ प्रिंट
                                            </button>
                                            <button onClick={handleDeleteBill} style={{ padding: '4px 8px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px', marginBottom: '3px' }}>
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

            {selectedBill && (
                <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', maxWidth: '600px', maxHeight: '80vh', overflow: 'auto', width: '90%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: '0', color: '#2c3e50' }}>
                                बिल तपशील - {selectedBill.billNumber}
                            </h3>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <button onClick={handleExportSingleBill} style={{ padding: '6px 12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    📄 PDF डाउनलोड
                                </button>
                                <button onClick={() => setSelectedBill(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}>
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
                                <tr style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-primary-accent))` }}>
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
                            <p style={{ fontSize: '18px', color: '#007bff' }}>
                                <strong>एकूण: {formatCurrency(selectedBill.total)}</strong>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillHistory;
