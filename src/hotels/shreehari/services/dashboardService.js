// src/hotels/jagdamba/services/dashboardService.js

// This service calculates dashboard statistics from locally stored bill history.
import { getBillHistory } from './billHistoryService';

/**
 * Calculates dashboard data (orders, revenue, pending payments) for a given date and filter type.
 * @param {string | Date} date - The reference date for the filter.
 * @param {'day' | 'week' | 'month' | 'year'} filterType - The time window for the calculation.
 * @returns {Promise<object>} An object containing dashboard figures.
 */
export const fetchDashboardData = async (date, filterType) => {
    try {
        const allBills = getBillHistory();

        // Helper to get a consistent Date object from a bill record.
        const getBillDate = (bill) => {
            if (bill.savedAt) {
                return new Date(bill.savedAt);
            }
            if (bill.date && typeof bill.date === 'string') {
                const parts = bill.date.split('/');
                if (parts.length === 3) {
                    const [day, month, year] = parts.map(Number);
                    if (!isNaN(day) && !isNaN(month) && !isNaN(year) && year > 1990 && year < 2100) {
                        return new Date(year, month - 1, day);
                    }
                }
            }
            return null;
        };

        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0);

        let startDate, endDate;

        switch (filterType) {
            case 'week':
                startDate = new Date(selectedDate);
                startDate.setDate(selectedDate.getDate() - 6); 
                endDate = new Date(selectedDate);
                endDate.setHours(23, 59, 59, 999);
                break;
            case 'month':
                startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
                endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
                endDate.setHours(23, 59, 59, 999);
                break;
            case 'year':
                startDate = new Date(selectedDate.getFullYear(), 0, 1);
                endDate = new Date(selectedDate.getFullYear(), 11, 31);
                endDate.setHours(23, 59, 59, 999);
                break;
            case 'day':
            default:
                startDate = new Date(selectedDate);
                endDate = new Date(selectedDate);
                endDate.setHours(23, 59, 59, 999);
                break;
        }

        const filteredBills = allBills.filter(bill => {
            const billDate = getBillDate(bill);
            return billDate && billDate >= startDate && billDate <= endDate;
        });

        let parcelOrders = { count: 0, totalAmount: 0 };
        let tableOrders = { count: 0, totalAmount: 0 };
        let pendingPayments = [];

        filteredBills.forEach(bill => {
            const total = bill.total || 0;
            const orderType = (bill.customerInfo && bill.customerInfo.tableNumber) ? 'table' : 'parcel';

            if (orderType === 'table') {
                tableOrders.count++;
                tableOrders.totalAmount += total;
            } else {
                parcelOrders.count++;
                parcelOrders.totalAmount += total;
            }

            const pendingAmount = bill.paymentInfo?.baki || 0;
            if (pendingAmount > 0) {
                pendingPayments.push({
                    customerName: bill.customerInfo?.name || 'Walk-in Customer',
                    pendingAmount: pendingAmount,
                    date: bill.date || (bill.savedAt ? new Date(bill.savedAt).toLocaleDateString('en-GB') : 'N/A'),
                    billId: bill.id,
                    orderType: orderType
                });
            }
        });
        
        return {
            parcelOrders,
            tableOrders,
            pendingPayments
        };

    } catch (error) {
        console.error('Error fetching dashboard data from localStorage:', error);
        return {
            parcelOrders: { count: 0, totalAmount: 0 },
            tableOrders: { count: 0, totalAmount: 0 },
            pendingPayments: []
        };
    }
};
