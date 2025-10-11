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

// Export bills to PDF (for backup/download)
export const exportBillHistoryToPDF = () => {
    const bills = getBillHistory();
    const user = getCurrentUser();
    const statistics = getBillStatistics();
    
    // Create new PDF document
    const doc = new jsPDF();
    
    // Set up fonts and colors
    doc.setFont('helvetica');
    
    // Header with VK Solutions branding
    doc.setFillColor(102, 126, 234); // VK brand color
    doc.rect(0, 0, 210, 25, 'F');
    
    // VK Solutions logo area (placeholder)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('VK Solutions', 15, 12);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Professional Software Development', 15, 18);
    
    // Contact details on right
    doc.text('+91 9689517133', 160, 12);
    doc.text('vikas4kale@gmail.com', 160, 18);
    
    // Hotel information
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`${user?.hotelName || 'Hotel'} - Bill History Report`, 15, 40);
    
    // Date and statistics
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const currentDate = new Date().toLocaleDateString();
    doc.text(`Export Date: ${currentDate}`, 15, 50);
    doc.text(`Total Bills: ${statistics.totalBills}`, 15, 58);
    doc.text(`Total Revenue: ₹${statistics.totalRevenue?.toFixed(2) || '0.00'}`, 15, 66);
    doc.text(`Today's Bills: ${statistics.todaysBills}`, 110, 58);
    doc.text(`Today's Revenue: ₹${statistics.todaysRevenue?.toFixed(2) || '0.00'}`, 110, 66);
    
    // Prepare table data
    const tableData = bills.map(bill => [
        bill.billNumber,
        bill.date,
        bill.customerInfo?.name || '-',
        bill.customerInfo?.tableNumber || '-',
        `₹${bill.total?.toFixed(2) || '0.00'}`,
        `₹${bill.paymentInfo?.jama?.toFixed(2) || '0.00'}`,
        `₹${bill.paymentInfo?.baki?.toFixed(2) || bill.total?.toFixed(2) || '0.00'}`
    ]);
    
    // Add table
    doc.autoTable({
        head: [['Bill No.', 'Date', 'Customer', 'Table', 'Total Amount', 'Received (Jama)', 'Balance (Baki)']],
        body: tableData,
        startY: 75,
        styles: {
            fontSize: 9,
            cellPadding: 3,
        },
        headStyles: {
            fillColor: [102, 126, 234],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        alternateRowStyles: {
            fillColor: [248, 249, 250]
        },
        columnStyles: {
            4: { halign: 'right' }, // Total Amount
            5: { halign: 'right' }, // Jama
            6: { halign: 'right', textColor: [220, 53, 69] } // Baki (red for pending)
        }
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Add footer
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('Generated by VK Solutions Hotel Management System', 15, 285);
        doc.text(`Page ${i} of ${pageCount}`, 180, 285);
        
        // Add timestamp
        const timestamp = new Date().toLocaleString();
        doc.text(`Generated on: ${timestamp}`, 15, 290);
    }
    
    return doc;
};

// Export single bill to PDF
export const exportSingleBillToPDF = (bill) => {
    const user = getCurrentUser();
    
    // Create new PDF document
    const doc = new jsPDF();
    
    // Set up fonts and colors
    doc.setFont('helvetica');
    
    // Header with VK Solutions branding
    doc.setFillColor(102, 126, 234);
    doc.rect(0, 0, 210, 25, 'F');
    
    // VK Solutions branding
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('VK Solutions', 15, 12);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Professional Software Development', 15, 18);
    doc.text('+91 9689517133 | vikas4kale@gmail.com', 15, 22);
    
    // Hotel name and bill info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(`${user?.hotelName || 'Hotel'}`, 15, 40);
    
    doc.setFontSize(16);
    doc.text(`Bill Receipt - ${bill.billNumber}`, 15, 50);
    
    // Bill details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${bill.date}`, 15, 65);
    doc.text(`Time: ${bill.time}`, 15, 72);
    
    // Customer information
    if (bill.customerInfo?.name || bill.customerInfo?.tableNumber || bill.customerInfo?.phoneNumber) {
        doc.setFont('helvetica', 'bold');
        doc.text('Customer Information:', 15, 85);
        doc.setFont('helvetica', 'normal');
        
        let yPos = 92;
        if (bill.customerInfo?.name) {
            doc.text(`Name: ${bill.customerInfo.name}`, 15, yPos);
            yPos += 7;
        }
        if (bill.customerInfo?.tableNumber) {
            doc.text(`Table: ${bill.customerInfo.tableNumber}`, 15, yPos);
            yPos += 7;
        }
        if (bill.customerInfo?.phoneNumber) {
            doc.text(`Phone: ${bill.customerInfo.phoneNumber}`, 15, yPos);
            yPos += 7;
        }
    }
    
    // Items table
    const itemsData = bill.items.map(item => [
        item.name,
        `₹${item.rate}`,
        item.quantity.toString(),
        `₹${(item.rate * item.quantity).toFixed(2)}`
    ]);
    
    doc.autoTable({
        head: [['Item', 'Rate', 'Qty', 'Amount']],
        body: itemsData,
        startY: 110,
        styles: {
            fontSize: 10,
            cellPadding: 4,
        },
        headStyles: {
            fillColor: [102, 126, 234],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        columnStyles: {
            1: { halign: 'right' },
            2: { halign: 'center' },
            3: { halign: 'right' }
        }
    });
    
    // Bill summary
    const finalY = doc.lastAutoTable.finalY + 10;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Subtotal: ₹${bill.subtotal?.toFixed(2) || '0.00'}`, 130, finalY);
    doc.text(`GST (18%): ₹${bill.tax?.toFixed(2) || '0.00'}`, 130, finalY + 7);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`Total: ₹${bill.total?.toFixed(2) || '0.00'}`, 130, finalY + 17);
    
    // Payment information
    if (bill.paymentInfo) {
        doc.setFontSize(12);
        doc.text(`Received (Jama): ₹${bill.paymentInfo.jama?.toFixed(2) || '0.00'}`, 130, finalY + 27);
        
        const baki = bill.paymentInfo.baki || 0;
        if (baki > 0) {
            doc.setTextColor(220, 53, 69); // Red for pending balance
        } else {
            doc.setTextColor(40, 167, 69); // Green for fully paid
        }
        doc.text(`Balance (Baki): ₹${baki.toFixed(2)}`, 130, finalY + 34);
    }
    
    // Thank you message
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(`Thank you for visiting ${user?.hotelName || 'our hotel'}!`, 15, finalY + 50);
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('Powered by VK Solutions Hotel Management System', 15, 280);
    const timestamp = new Date().toLocaleString();
    doc.text(`Generated: ${timestamp}`, 15, 285);
    
    return doc;
};
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
        <title>Bill ${bill.billNumber} - ${user?.hotelName || 'Hotel'}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
                color: #333;
            }
            .header {
                text-align: center;
                border-bottom: 2px solid #667eea;
                padding-bottom: 15px;
                margin-bottom: 20px;
            }
            .vk-branding {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 10px;
                margin: -20px -20px 20px -20px;
                font-size: 12px;
            }
            .hotel-name {
                font-size: 24px;
                font-weight: bold;
                color: #2c3e50;
                margin: 10px 0;
            }
            .bill-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                border-bottom: 1px solid #ddd;
                padding-bottom: 10px;
            }
            .customer-info {
                margin-bottom: 20px;
                background: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }
            th {
                background-color: #667eea;
                color: white;
                font-weight: bold;
            }
            .amount-col {
                text-align: right;
            }
            .bill-summary {
                text-align: right;
                font-size: 14px;
            }
            .total-row {
                font-size: 18px;
                font-weight: bold;
                color: #2c3e50;
                border-top: 2px solid #667eea;
                padding-top: 10px;
                margin-top: 10px;
            }
            .payment-info {
                background: #e8f4fd;
                padding: 15px;
                border-radius: 5px;
                margin: 15px 0;
                border: 1px solid #0066cc;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                font-size: 12px;
                color: #666;
            }
            @media print {
                body { margin: 0; }
                .vk-branding { margin: 0; }
            }
        </style>
    </head>
    <body>
        <div class="vk-branding">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>VK Solutions</strong> - Professional Software Development
                </div>
                <div>
                    📱 +91 9689517133 | 📧 vikas4kale@gmail.com
                </div>
            </div>
        </div>

        <div class="header">
            <div class="hotel-name">${user?.hotelName || 'Hotel'}</div>
            <div>Bill Receipt</div>
        </div>

        <div class="bill-info">
            <div><strong>Bill No:</strong> ${bill.billNumber}</div>
            <div><strong>Date:</strong> ${bill.date}</div>
            <div><strong>Time:</strong> ${bill.time}</div>
        </div>

        ${(bill.customerInfo?.name || bill.customerInfo?.tableNumber || bill.customerInfo?.phoneNumber) ? `
        <div class="customer-info">
            <h3>Customer Information</h3>
            ${bill.customerInfo?.name ? `<p><strong>Name:</strong> ${bill.customerInfo.name}</p>` : ''}
            ${bill.customerInfo?.tableNumber ? `<p><strong>Table:</strong> ${bill.customerInfo.tableNumber}</p>` : ''}
            ${bill.customerInfo?.phoneNumber ? `<p><strong>Phone:</strong> ${bill.customerInfo.phoneNumber}</p>` : ''}
        </div>
        ` : ''}

        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Rate</th>
                    <th>Qty</th>
                    <th class="amount-col">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${bill.items.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>₹${item.rate}</td>
                        <td>${item.quantity}</td>
                        <td class="amount-col">₹${(item.rate * item.quantity).toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="bill-summary">
            <div>Subtotal: ₹${bill.subtotal?.toFixed(2) || '0.00'}</div>
            <div>GST (18%): ₹${bill.tax?.toFixed(2) || '0.00'}</div>
            <div class="total-row">Total: ₹${bill.total?.toFixed(2) || '0.00'}</div>
        </div>

        ${bill.paymentInfo ? `
        <div class="payment-info">
            <h3>Payment Information</h3>
            <div style="display: flex; justify-content: space-between;">
                <span>Received (जमा):</span>
                <span>₹${bill.paymentInfo.jama?.toFixed(2) || '0.00'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 10px; font-weight: bold; color: ${(bill.paymentInfo.baki || 0) > 0 ? '#dc3545' : '#28a745'};">
                <span>Balance (बाकी):</span>
                <span>₹${(bill.paymentInfo.baki || bill.total || 0).toFixed(2)}</span>
            </div>
        </div>
        ` : ''}

        <div class="footer">
            <p>Thank you for visiting ${user?.hotelName || 'our hotel'}!</p>
            <p>Powered by VK Solutions Hotel Management System</p>
        </div>

        <script>
            window.onload = function() {
                window.print();
                window.onafterprint = function() {
                    window.close();
                };
            };
        </script>
    </body>
    </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    return true;
};