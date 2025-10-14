// Bill History Service for managing saved bills
import { getCurrentUser, getCurrentHotelId } from './authService';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

// Update bill payment information
export const updateBillPayment = (billId, paymentInfo) => {
    const bills = getBillHistory();
    const updatedBills = bills.map(bill => {
        if (bill.id === billId) {
            return {
                ...bill,
                paymentInfo: {
                    ...bill.paymentInfo,
                    ...paymentInfo
                }
            };
        }
        return bill;
    });
    
    const hotelId = getCurrentHotelId();
    localStorage.setItem(`bill_history_${hotelId}`, JSON.stringify(updatedBills));
    
    return true;
};

// Delete bill from history
export const deleteBillFromHistory = (billId) => {
    const bills = getBillHistory();
    const updatedBills = bills.filter(bill => bill.id !== billId);
    
    const hotelId = getCurrentHotelId();
    localStorage.setItem(`bill_history_${hotelId}`, JSON.stringify(updatedBills));
    
    return true;
};

// Filter bills by date range or search term
export const filterBills = (searchTerm = '', startDate = '', endDate = '') => {
    const bills = getBillHistory();
    
    return bills.filter(bill => {
        const matchesSearch = !searchTerm || 
            bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bill.customerInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bill.customerInfo?.phoneNumber?.includes(searchTerm);
            
        const matchesDateRange = (!startDate || bill.date >= startDate) &&
            (!endDate || bill.date <= endDate);
            
        return matchesSearch && matchesDateRange;
    });
};

// Get bill statistics
export const getBillStatistics = () => {
    const bills = getBillHistory();
    
    const totalBills = bills.length;
    const totalRevenue = bills.reduce((sum, bill) => sum + (bill.total || 0), 0);
    const totalReceived = bills.reduce((sum, bill) => sum + (bill.paymentInfo?.jama || 0), 0);
    const totalPending = bills.reduce((sum, bill) => sum + (bill.paymentInfo?.baki || 0), 0);
    
    return {
        totalBills,
        totalRevenue,
        totalReceived,
        totalPending,
        averageBillAmount: totalBills > 0 ? totalRevenue / totalBills : 0
    };
};

// Export single bill to PDF
export const exportSingleBillToPDF = (bill) => {
    try {
        console.log('Starting PDF export...');
        
        // Validate bill data
        if (!bill) {
            throw new Error('No bill data provided');
        }
        
        console.log('Creating jsPDF instance...');
        // Create new PDF document
        const doc = new jsPDF();
        
        console.log('Adding basic text to PDF...');
        // Add very basic content
        doc.text('VK Solutions', 20, 20);
        doc.text('Hotel Management System', 20, 30);
        doc.text(`Bill Number: ${bill.billNumber || 'N/A'}`, 20, 50);
        doc.text(`Date: ${bill.date || 'N/A'}`, 20, 60);
        doc.text(`Total: Rs. ${(bill.total || 0).toFixed(2)}`, 20, 70);
        
        console.log('PDF created successfully');
        return doc;
    } catch (error) {
        console.error('Detailed PDF error:', error);
        console.error('Error stack:', error.stack);
        throw error;
    }
};

// Export bill history to JSON
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

// Print single bill (for browser print)
export const printSingleBill = (bill) => {
    const user = getCurrentUser();
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Bill - ${bill.billNumber}</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .bill-info { margin-bottom: 20px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .items-table th { background-color: #f2f2f2; }
            .total-section { text-align: right; margin-top: 20px; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class="header">
            <h2>${user?.hotelName || 'Hotel'}</h2>
            <h3>Bill Receipt - ${bill.billNumber}</h3>
        </div>
        
        <div class="bill-info">
            <p><strong>Date:</strong> ${bill.date}</p>
            <p><strong>Time:</strong> ${bill.time}</p>
            ${bill.customerInfo?.name ? `<p><strong>Customer:</strong> ${bill.customerInfo.name}</p>` : ''}
        </div>
        
        <table class="items-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Rate</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                ${bill.items.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>₹${item.rate}</td>
                        <td>${item.quantity}</td>
                        <td>₹${(item.rate * item.quantity).toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div class="total-section">
            <p><strong>Subtotal: ₹${(bill.subtotal || 0).toFixed(2)}</strong></p>
            <p><strong>Tax: ₹${(bill.tax || 0).toFixed(2)}</strong></p>
            <p><strong>Total: ₹${(bill.total || 0).toFixed(2)}</strong></p>
            ${bill.paymentInfo ? `
                <p>Received (Jama): ₹${(bill.paymentInfo.jama || 0).toFixed(2)}</p>
                <p>Balance (Baki): ₹${(bill.paymentInfo.baki || 0).toFixed(2)}</p>
            ` : ''}
        </div>
        
        <div class="footer">
            <p>Thank you for visiting ${user?.hotelName || 'our hotel'}!</p>
            <p>Powered by VK Solutions Hotel Management System</p>
        </div>
    </body>
    </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
};