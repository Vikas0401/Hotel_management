/* eslint-disable unicode-bom */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';
import { fetchDashboardData } from '../services/dashboardService';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '../styles/Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState(new Date());
    const [filterType, setFilterType] = useState('day');
    const [dashboardData, setDashboardData] = useState({
        parcelOrders: {
            count: 0,
            totalAmount: 0
        },
        tableOrders: {
            count: 0,
            totalAmount: 0
        },
        pendingPayments: []
    });

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }
        
        const loadDashboardData = async () => {
            try {
                const data = await fetchDashboardData(startDate, filterType);
                setDashboardData(data);
            } catch (error) {
                console.error('Error loading dashboard data:', error);
                // You might want to show an error message to the user here
            }
        };

        loadDashboardData();
    }, [navigate, startDate, filterType]);

    return (
        <div className="dashboard">
            <section className="main-layout">
                <div className="filter-section">
                    <div className="date-filter">
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="dd/MM/yyyy"
                            className="date-picker"
                        />
                        <select 
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="filter-select"
                        >
                            <option value="day">दैनिक</option>
                            <option value="week">साप्ताहिक</option>
                            <option value="month">मासिक</option>
                            <option value="year">वार्षिक</option>
                        </select>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>पार्सल ऑर्डर</h3>
                        <div className="stat-content">
                            <p>एकूण ऑर्डर: {dashboardData.parcelOrders.count}</p>
                            <p>एकूण रक्कम: ₹{dashboardData.parcelOrders.totalAmount}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <h3>टेबल ऑर्डर</h3>
                        <div className="stat-content">
                            <p>एकूण ऑर्डर: {dashboardData.tableOrders.count}</p>
                            <p>एकूण रक्कम: ₹{dashboardData.tableOrders.totalAmount}</p>
                        </div>
                    </div>

                    <div className="stat-card pending-payments">
                        <h3>बाकी असलेले</h3>
                        <div className="pending-list">
                            {dashboardData.pendingPayments.map((payment, index) => (
                                <div key={index} className="pending-item">
                                    <span>{payment.customerName}</span>
                                    <span>₹{payment.pendingAmount}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;