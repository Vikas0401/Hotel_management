import { getDatabase, ref, query, get, orderByChild, startAt, endAt } from 'firebase/database';

export const fetchDashboardData = async (date, filterType) => {
    const db = getDatabase();
    
    // Calculate date range based on filter type
    const startDate = new Date(date);
    let endDate = new Date(date);
    
    switch (filterType) {
        case 'week':
            startDate.setDate(startDate.getDate() - 7);
            break;
        case 'month':
            startDate.setDate(1);
            endDate.setMonth(endDate.getMonth() + 1, 0); // Last day of current month
            break;
        case 'year':
            startDate.setMonth(0, 1); // January 1st
            endDate.setMonth(11, 31); // December 31st
            break;
        default: // day
            // Start and end date are the same for daily view
            break;
    }

    try {
        // Fetch parcel orders
        const parcelOrdersRef = ref(db, 'jagdamba/orders/parcel');
        const parcelQuery = query(
            parcelOrdersRef,
            orderByChild('date'),
            startAt(startDate.toISOString()),
            endAt(endDate.toISOString())
        );
        const parcelSnapshot = await get(parcelQuery);
        
        // Fetch table orders
        const tableOrdersRef = ref(db, 'jagdamba/orders/table');
        const tableQuery = query(
            tableOrdersRef,
            orderByChild('date'),
            startAt(startDate.toISOString()),
            endAt(endDate.toISOString())
        );
        const tableSnapshot = await get(tableQuery);
        
        // Fetch pending payments
        const pendingPaymentsRef = ref(db, 'jagdamba/pendingPayments');
        const pendingPaymentsSnapshot = await get(pendingPaymentsRef);
        
        // Calculate totals
        let parcelOrders = { count: 0, totalAmount: 0 };
        let tableOrders = { count: 0, totalAmount: 0 };
        let pendingPayments = [];
        
        parcelSnapshot.forEach(child => {
            const order = child.val();
            parcelOrders.count++;
            parcelOrders.totalAmount += order.totalAmount || 0;
        });
        
        tableSnapshot.forEach(child => {
            const order = child.val();
            tableOrders.count++;
            tableOrders.totalAmount += order.totalAmount || 0;
        });
        
        pendingPaymentsSnapshot.forEach(child => {
            const payment = child.val();
            pendingPayments.push({
                customerName: payment.customerName,
                pendingAmount: payment.amount,
                date: payment.date
            });
        });
        
        return {
            parcelOrders,
            tableOrders,
            pendingPayments
        };
        
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
    }
};