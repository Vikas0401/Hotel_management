// Bill History Service for managing saved bills
import { getCurrentUser, getCurrentHotelId } from './authService';
import { sendMonthlyReportByEmail } from './emailService'; // Import the email service
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Sample bill data for demo purposes
const getSampleBillData = () => {
    // ... (rest of the function remains the same)
};

// Save bill to history
export const saveBillToHistory = (billData) => {
    // ... (rest of the function remains the same)
};

// Get bill history for current hotel
export const getBillHistory = () => {
    // ... (rest of the function remains the same)
};

// Get bill by ID
export const getBillById = (billId) => {
    // ... (rest of the function remains the same)
};

// Update bill payment information
export const updateBillPayment = (billId, paymentInfo) => {
    // ... (rest of the function remains the same)
};

// Delete bill from history
export const deleteBillFromHistory = (billId) => {
    // ... (rest of the function remains the same)
};

// Filter bills by date range or search term
export const filterBills = (searchTerm = '', startDate = '', endDate = '') => {
    // ... (rest of the function remains the same)
};

// Get bill statistics
export const getBillStatistics = () => {
    // ... (rest of the function remains the same)
};

// Export single bill to PDF
export const exportSingleBillToPDF = (bill) => {
    // ... (rest of the function remains the same)
};

// Export bill history to JSON
export const exportBillHistory = () => {
    // ... (rest of the function remains the same)
};

// Auto-export function for monthly reports
export const autoExportMonthlyReport = async () => { // Make the function async
    const today = new Date();
    const isFirstDayOfMonth = today.getDate() === 1;

    if (isFirstDayOfMonth) {
        // Get previous month's data
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const startDate = lastMonth.toISOString().split('T')[0];
        const endDate = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0];

        // Filter bills for last month
        const allBills = getBillHistory();
        const monthlyBills = allBills.filter(bill => {
            const billDate = new Date(bill.date.split('/').reverse().join('-'));
            return billDate >= new Date(startDate) && billDate <= new Date(endDate);
        });

        if (monthlyBills.length > 0) {
            const doc = generateMonthlyPDF(monthlyBills, lastMonth);
            const monthName = lastMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
            const fileName = `Monthly_Report_${monthName.replace(' ', '_')}.pdf`;
            
            // Get the PDF as a Blob
            const pdfBlob = doc.output('blob');

            // Send the PDF by email
            await sendMonthlyReportByEmail(pdfBlob);
            
            // Save the file locally as before
            doc.save(fileName);

            console.log(`Auto-exported and emailed monthly report: ${fileName}`);
            return true;
        }
    }
    return false;
};

// Generate PDF for monthly reports
const generateMonthlyPDF = (bills, month) => {
    // ... (rest of the function remains the same)
};

// Export bills to PDF (for backup/download)
export const exportBillHistoryToPDF = (monthlyFilter = null) => {
    // ... (rest of the function remains the same)
};

// Helper function to generate bill table
const generateBillTable = (doc, bills, startYPos) => {
    // ... (rest of the function remains the same)
};

// Print single bill (for browser print)
export const printSingleBill = (bill) => {
    // ... (rest of the function remains the same)
};
