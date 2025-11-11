import { getCurrentUser } from './authService';

// This is a placeholder for a real email API call.
// In a production environment, this would be an API call to a backend service.
const sendEmailAPI = async (emailData) => {
    console.log('Simulating email sending:', emailData);
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate a successful API call
            resolve({ success: true, message: 'Email sent successfully.' });
        }, 1000);
    });
};

export const sendMonthlyReportByEmail = async (pdfBlob) => {
    const user = getCurrentUser();
    const hotelEmail = user?.email;

    if (!hotelEmail) {
        console.error('No email address found for the current hotel.');
        return;
    }

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const monthName = lastMonth.toLocaleString('default', { month: 'long' });
    const year = lastMonth.getFullYear();

    const emailData = {
        to: hotelEmail,
        subject: `Monthly Bill Report for ${monthName} ${year}`,
        body: `Please find attached the monthly bill report for ${user.hotelName}.`,
        attachments: [
            {
                filename: `Bill_History_${monthName}_${year}.pdf`,
                content: pdfBlob,
                contentType: 'application/pdf',
            },
        ],
    };

    try {
        const response = await sendEmailAPI(emailData);
        if (response.success) {
            console.log(`Monthly report sent to ${hotelEmail}`);
            alert(`Monthly report has been successfully sent to ${hotelEmail}.`);
        } else {
            console.error('Failed to send monthly report:', response.message);
            alert('Failed to send the monthly report. Please try again later.');
        }
    } catch (error) {
        console.error('Error sending monthly report:', error);
        alert('An unexpected error occurred while sending the email. Please check the console for more details.');
    }
};