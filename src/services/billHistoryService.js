// Bill History Service for managing saved bills
import { getCurrentUser, getCurrentHotelId } from './authService';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Sample bill data for demo purposes
const getSampleBillData = () => {
    return [
        {
            id: 'BILL_SAMPLE_001',
            billNumber: 'B123456',
            date: '10/10/2025',
            time: '2:30:45 PM',
            customerInfo: {
                name: 'Demo Customer 1',
                tableNumber: 'T5',
                phoneNumber: '9876543210'
            },
            items: [
                { code: '101', name: 'Sample Special Thali', rate: 250, quantity: 2 },
                { code: '201', name: 'Vada Pav', rate: 30, quantity: 3 },
                { code: '601', name: 'Masala Tea', rate: 25, quantity: 2 }
            ],
            subtotal: 590,
            tax: 0,
            total: 590,
            paymentInfo: { jama: 600, baki: 0 },
            hotelName: 'Sample Hotel',
            savedAt: '2025-10-10T14:30:45.000Z',
            savedBy: 'sample_user'
        },
        {
            id: 'BILL_SAMPLE_002',
            billNumber: 'B123457',
            date: '11/10/2025',
            time: '7:15:20 PM',
            customerInfo: {
                name: 'Demo Customer 2',
                tableNumber: 'T3',
                phoneNumber: '9123456789'
            },
            items: [
                { code: '102', name: 'Mini Thali', rate: 150, quantity: 1 },
                { code: '301', name: 'Veg Pulao', rate: 160, quantity: 1 },
                { code: '602', name: 'Buttermilk', rate: 35, quantity: 2 }
            ],
            subtotal: 380,
            tax: 0,
            total: 380,
            paymentInfo: { jama: 380, baki: 0 },
            hotelName: 'Sample Hotel',
            savedAt: '2025-10-11T19:15:20.000Z',
            savedBy: 'sample_user'
        },
        {
            id: 'BILL_SAMPLE_003',
            billNumber: 'B123458',
            date: '12/10/2025',
            time: '1:45:10 PM',
            customerInfo: {
                name: 'Demo Customer 3',
                tableNumber: 'T7',
                phoneNumber: '9876512345'
            },
            items: [
                { code: '202', name: 'Bhaji Plate', rate: 80, quantity: 2 },
                { code: '401', name: 'Roti', rate: 18, quantity: 4 },
                { code: '501', name: 'Dal Tadka', rate: 120, quantity: 1 }
            ],
            subtotal: 292,
            tax: 0,
            total: 292,
            paymentInfo: { jama: 300, baki: 0 },
            hotelName: 'Sample Hotel',
            savedAt: '2025-10-12T13:45:10.000Z',
            savedBy: 'sample_user'
        }
    ];
};

// Save bill to history
export const saveBillToHistory = (billData) => {
    console.log('saveBillToHistory called with:', billData);
    
    const hotelId = getCurrentHotelId();
    const user = getCurrentUser();
    
    console.log('Hotel ID:', hotelId);
    console.log('User:', user);
    
    // Return fake success for sample hotel (read-only mode)
    if (hotelId === 'sample') {
        console.log('Sample hotel detected - returning fake success');
        return 'BILL_SAMPLE_DEMO';
    }
    
    if (!hotelId || !billData) {
        console.log('Missing hotelId or billData:', { hotelId, billData });
        return false;
    }
    
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
    
    console.log('Bill record created:', billRecord);
    
    // Get existing bills for this hotel
    const existingBills = getBillHistory();
    console.log('Existing bills:', existingBills);
    
    // Add new bill to the beginning of the array
    const updatedBills = [billRecord, ...existingBills];
    
    // Save to localStorage
    const storageKey = `bill_history_${hotelId}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedBills));
    console.log('Saved to localStorage with key:', storageKey);
    console.log('Updated bills count:', updatedBills.length);
    
    return billRecord.id;
};

// Get bill history for current hotel
export const getBillHistory = () => {
    const hotelId = getCurrentHotelId();
    console.log('getBillHistory called with hotelId:', hotelId);
    
    if (!hotelId) {
        console.log('No hotelId found, returning empty array');
        return [];
    }
    
    // Return sample data for sample hotel
    if (hotelId === 'sample') {
        return getSampleBillData();
    }
    
    const storageKey = `bill_history_${hotelId}`;
    const bills = localStorage.getItem(storageKey);
    console.log('Retrieved from localStorage with key:', storageKey);
    console.log('Raw data from localStorage:', bills);
    
    const parsedBills = bills ? JSON.parse(bills) : [];
    console.log('Parsed bills:', parsedBills);
    console.log('Number of bills found:', parsedBills.length);
    
    return parsedBills;
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
        // Ensure searchTerm is a string and handle null/undefined
        const searchStr = String(searchTerm || '').toLowerCase();
        
        const matchesSearch = !searchStr || 
            bill.billNumber?.toLowerCase().includes(searchStr) ||
            bill.customerInfo?.name?.toLowerCase().includes(searchStr) ||
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
        
        // Show fake save dialog for sample hotel
        const hotelId = getCurrentHotelId();
        if (hotelId === 'sample') {
            // Create a fake file download experience
            const link = document.createElement('a');
            link.download = `sample_bill_${bill.billNumber || 'demo'}.pdf`;
            link.href = 'data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKL01lZGlhQm94IFswIDAgNTk1IDg0Ml0KPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovUmVzb3VyY2VzIDw8Cj4+Ci9Db250ZW50cyA0IDAgUgo+PgplbmRvYmoKNCAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVAovRjEgMTIgVGYKNzIgNzIwIFRkCihTYW1wbGUgQmlsbCBQREYpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDUKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAowMDAwMDAwMTk0IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNQovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKMjg5CiUlRU9GCg==';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log('Sample hotel: Fake single bill PDF export completed');
            return true;
        }
        
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

// Export bills to PDF (for backup/download)
export const exportBillHistoryToPDF = () => {
    try {
        const hotelId = getCurrentHotelId();
        
        // Show fake save dialog for sample hotel
        if (hotelId === 'sample') {
            // Create a fake file download experience
            const link = document.createElement('a');
            link.download = 'sample_bill_history.pdf';
            link.href = 'data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKL01lZGlhQm94IFswIDAgNTk1IDg0Ml0KPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovUmVzb3VyY2VzIDw8Cj4+Ci9Db250ZW50cyA0IDAgUgo+PgplbmRvYmoKNCAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVAovRjEgMTIgVGYKNzIgNzIwIFRkCihTYW1wbGUgUERGKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDU4IDAwMDAwIG4gCjAwMDAwMDAxMTUgMDAwMDAgbiAKMDAwMDAwMDE5NCAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDUKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjI4OQolJUVPRgo=';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log('Sample hotel: Fake PDF export completed');
            return true;
        }
        
        const bills = getBillHistory();
        const user = getCurrentUser();
        
        if (bills.length === 0) {
            throw new Error('No bills to export');
        }
        
        // Create new PDF document
        const doc = new jsPDF();
        
        // Add basic header
        doc.text('VK Solutions', 20, 20);
        doc.text(`${user?.hotelName || 'Hotel'} - Bill History`, 20, 30);
        doc.text(`Export Date: ${new Date().toLocaleDateString()}`, 20, 40);
        doc.text(`Total Bills: ${bills.length}`, 20, 50);
        
        // Add bills summary
        let yPos = 70;
        bills.slice(0, 10).forEach((bill, index) => { // Limit to first 10 bills
            doc.text(`${index + 1}. Bill ${bill.billNumber} - ${bill.date} - Rs. ${(bill.total || 0).toFixed(2)}`, 20, yPos);
            yPos += 10;
        });
        
        if (bills.length > 10) {
            doc.text(`... and ${bills.length - 10} more bills`, 20, yPos);
        }
        
        return doc;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
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