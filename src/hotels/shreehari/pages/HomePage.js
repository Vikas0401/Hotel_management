import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardData } from '../services/dashboardService';
import { isAuthenticated } from '../services/authService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaRegCalendarAlt, FaFilter, FaBoxOpen, FaClipboardList, FaUsers } from 'react-icons/fa';
import '../styles/Dashboard.css';

const HomePage = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filterType, setFilterType] = useState('day');
    const [dashboardData, setDashboardData] = useState({
        parcelOrders: { count: 0, totalAmount: 0 },
        tableOrders: { count: 0, totalAmount: 0 },
        pendingPayments: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
        } else {
            const loadData = async () => {
                setIsLoading(true);
                try {
                    const data = await fetchDashboardData(selectedDate, filterType);
                    setDashboardData(data);
                } catch (error) {
                    console.error('Failed to load dashboard data:', error);
                }
                setIsLoading(false);
            };
            loadData();
        }
    }, [navigate, selectedDate, filterType]);

    const handleFilterClick = (filter) => {
        setActiveFilter(prevFilter => prevFilter === filter ? null : filter);
    };

    const DatePickerCustomHeader = ({ date, decreaseMonth, increaseMonth }) => (
        <div className="custom-datepicker-header">
            <button onClick={decreaseMonth} className="btn-nav">‹</button>
            <span className="month-year">
                {date.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={increaseMonth} className="btn-nav">›</button>
        </div>
    );

    const StatCard = ({ icon, title, count, totalAmount, isLoading, onClick, isActive }) => (
        <div 
            className={`stat-card ${isLoading ? 'loading' : ''} ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            <div className="stat-icon">{icon}</div>
            <div className="stat-info">
                <h3>{title}</h3>
                {isLoading ? (
                    <div className="loader"></div>
                ) : (
                    <>
                        <p>Total Orders: <span>{count}</span></p>
                        <p>Total Amount: <span>₹{totalAmount.toFixed(2)}</span></p>
                    </>
                )}
            </div>
        </div>
    );

    const getDateFormat = () => {
        switch (filterType) {
            case 'day': return 'dd/MM/yyyy';
            case 'week': return "'Week' w, yyyy";
            case 'month': return 'MM/yyyy';
            case 'year': return 'yyyy';
            default: return 'dd/MM/yyyy';
        }
    };

    const filteredPayments = activeFilter
        ? dashboardData.pendingPayments.filter(p => p.orderType === activeFilter)
        : dashboardData.pendingPayments;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h2>Dashboard</h2>
                <div className="controls">
                    <div className="filter-control">
                        <FaFilter className="control-icon" />
                        <select 
                            value={filterType} 
                            onChange={e => setFilterType(e.target.value)} 
                            className="filter-select"
                        >
                            <option value="day">Daily</option>
                            <option value="week">Weekly</option>
                            <option value="month">Monthly</option>
                            <option value="year">Yearly</option>
                        </select>
                    </div>
                    <div className="date-picker-control">
                        <FaRegCalendarAlt className="control-icon" />
                        <DatePicker
                            selected={selectedDate}
                            onChange={date => setSelectedDate(date)}
                            dateFormat={getDateFormat()}
                            showMonthYearPicker={filterType === 'month'}
                            showYearPicker={filterType === 'year'}
                            showWeekNumbers={filterType === 'week'}
                            className="date-picker-input"
                            renderCustomHeader={DatePickerCustomHeader}
                            popperPlacement="bottom-end"
                        />
                    </div>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="stats-grid">
                    <StatCard 
                        icon={<FaBoxOpen />} 
                        title="Parcel Orders"
                        count={dashboardData.parcelOrders.count}
                        totalAmount={dashboardData.parcelOrders.totalAmount}
                        isLoading={isLoading}
                        onClick={() => handleFilterClick('parcel')}
                        isActive={activeFilter === 'parcel'}
                    />
                    <StatCard 
                        icon={<FaClipboardList />} 
                        title="Table Orders"
                        count={dashboardData.tableOrders.count}
                        totalAmount={dashboardData.tableOrders.totalAmount}
                        isLoading={isLoading}
                        onClick={() => handleFilterClick('table')}
                        isActive={activeFilter === 'table'}
                    />
                </div>

                <div className="pending-payments-section">
                    <div className="section-header">
                        <FaUsers className="section-icon" />
                        <h3>Pending Payments</h3>
                    </div>
                    {isLoading ? (
                        <div className="loader-container"><div className="loader"></div></div>
                    ) : (
                        <div className="pending-list">
                            {filteredPayments.length > 0 ? (
                                filteredPayments.map((p, index) => (
                                    <div key={index} className="pending-item">
                                        <span className="customer-name">{p.customerName}</span>
                                        <span className="pending-date">{p.date}</span>
                                        <span className="pending-amount">₹{p.pendingAmount.toFixed(2)}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="no-pending">No pending payments match the selected filter.</p>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default HomePage;
