// Bill History Service for managing saved bills
import { getCurrentUser, getCurrentHotelId } from './authService';

// Save bill to history
export const saveBillToHistory = (billData) => {
    const hotelId = getCurrentHotelId();
    const user = getCurrentUser();
    
    if (!hotelId || !billData) return false;
    
    const billRecord = {
        id: 'BILL_' + Date.now(),
        billNumber: billData.billNumber,
        date: billData.date,
        time: billData.time,
        customerInfo: billData.customerInfo,
        items: billData.items,
        subtotal: billData.subtotal,
        tax: billData.tax,
        total: billData.total,
        paymentInfo: billData.paymentInfo || { jama: 0, baki: billData.total || 0 },
        hotelName: user?.hotelName,
        savedAt: new Date().toISOString(),
        savedBy: user?.username
    };
    
    // Get existing bills for this hotel
    const existingBills = getBillHistory();
    
    // Add new bill to the beginning of the array
    const updatedBills = [billRecord, ...existingBills];
    
    // Save to localStorage
    localStorage.setItem(`bill_history_${hotelId}`, JSON.stringify(updatedBills));
    
    return billRecord.id;
};

// Get bill history for current hotel
export const getBillHistory = () => {
    const hotelId = getCurrentHotelId();
    if (!hotelId) return [];
    
    const bills = localStorage.getItem(`bill_history_${hotelId}`);
    return bills ? JSON.parse(bills) : [];
};

// Get bill by ID
export const getBillById = (billId) => {
    const bills = getBillHistory();
    return bills.find(bill => bill.id === billId);
};

// Delete bill from history
export const deleteBillFromHistory = (billId) => {
    const hotelId = getCurrentHotelId();
    if (!hotelId) return false;
    
    const bills = getBillHistory();
    const updatedBills = bills.filter(bill => bill.id !== billId);
    
    localStorage.setItem(`bill_history_${hotelId}`, JSON.stringify(updatedBills));
    return true;
};

// Update payment information for a specific bill
export const updateBillPayment = (billId, paymentInfo) => {
    const hotelId = getCurrentHotelId();
    if (!hotelId) return false;
    
    const bills = getBillHistory();
    const updatedBills = bills.map(bill => {
        if (bill.id === billId) {
            return {
                ...bill,
                paymentInfo: {
                    jama: paymentInfo.jama,
                    baki: paymentInfo.baki
                },
                lastUpdated: new Date().toISOString()
            };
        }
        return bill;
    });
    
    localStorage.setItem(`bill_history_${hotelId}`, JSON.stringify(updatedBills));
    return true;
};

// Filter bills by customer name and date range
export const filterBills = (filters) => {
    const bills = getBillHistory();
    
    return bills.filter(bill => {
        // Filter by customer name
        if (filters.customerName) {
            const customerName = bill.customerInfo?.name?.toLowerCase() || '';
            const searchName = filters.customerName.toLowerCase();
            if (!customerName.includes(searchName)) {
                return false;
            }
        }
        
        // Filter by date range
        if (filters.startDate) {
            const billDate = new Date(bill.date);
            const startDate = new Date(filters.startDate);
            if (billDate < startDate) {
                return false;
            }
        }
        
        if (filters.endDate) {
            const billDate = new Date(bill.date);
            const endDate = new Date(filters.endDate);
            if (billDate > endDate) {
                return false;
            }
        }
        
        return true;
    });
};

// Get bill statistics
export const getBillStatistics = () => {
    const bills = getBillHistory();
    
    const totalBills = bills.length;
    const totalRevenue = bills.reduce((sum, bill) => sum + bill.total, 0);
    const averageBillAmount = totalBills > 0 ? totalRevenue / totalBills : 0;
    
    // Get today's bills
    const today = new Date().toLocaleDateString();
    const todaysBills = bills.filter(bill => bill.date === today);
    const todaysRevenue = todaysBills.reduce((sum, bill) => sum + bill.total, 0);
    
    return {
        totalBills,
        totalRevenue,
        averageBillAmount,
        todaysBills: todaysBills.length,
        todaysRevenue
    };
};

// Export bills to JSON (for backup/download)
export const exportBillHistory = () => {
    const bills = getBillHistory();
    const user = getCurrentUser();
    
    const exportData = {
        hotelName: user?.hotelName,
        exportDate: new Date().toISOString(),
        totalBills: bills.length,
        bills: bills
    };
    
    return JSON.stringify(exportData, null, 2);
};