// Hotel credentials and their respective menus
const hotelCredentials = {
    "matoshree": {
        username: "matoshree_admin",
        password: "matoshree@2025",
        hotelName: "हॉटेल मातोश्री",
        hotelId: "matoshree",
        isAdmin: true,
        address: "वांबोरी, राहुरी, जिल्हा - अहिल्यानगर, महाराष्ट्र - ४१३७०४"
    },
    "maharashtra": {
        username: "maharashtra_admin", 
        password: "maharashtra@2025",
        hotelName: "Maharashtra Hotel",
        hotelId: "maharashtra",
        isAdmin: true,
        address: "महाराष्ट्र, भारत"
    },
    "sample": {
        username: "sample_user",
        password: "sample@2025",
        hotelName: "Sample Hotel",
        hotelId: "sample",
        isAdmin: false,
        address: "Demo Location, India",
        isReadOnly: true
    }
};

export const login = (username, password) => {
    // Find matching hotel credentials
    const hotel = Object.values(hotelCredentials).find(
        h => h.username === username && h.password === password
    );

    if (hotel) {
        const userSession = {
            username: hotel.username,
            hotelName: hotel.hotelName,
            hotelId: hotel.hotelId,
            isAdmin: hotel.isAdmin,
            address: hotel.address,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem("user", JSON.stringify(userSession));
        localStorage.setItem("hotel_name_version", "marathi_v1");
        
        // Set session flag to indicate this is a new session
        sessionStorage.setItem("user_session", "active");
        
        return true;
    }
    return false;
};

export const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("hotel_name_version");
    sessionStorage.removeItem("user_session");
    
    // Clear browser history to prevent back navigation
    // Replace current history entry with login page
    window.history.replaceState(null, null, '/login');
    
    // Clear forward/back history by replacing the entire history
    if (window.history.length > 1) {
        window.history.go(-(window.history.length - 1));
    }
};

export const isAuthenticated = () => {
    const user = localStorage.getItem("user");
    const sessionActive = sessionStorage.getItem("user_session");
    
    if (user && sessionActive === "active") {
        // Check if we need to update hotel name to Marathi version
        const nameVersion = localStorage.getItem("hotel_name_version");
        if (nameVersion !== "marathi_v1") {
            // Force logout to refresh with new Marathi names
            localStorage.removeItem("user");
            localStorage.removeItem("hotel_name_version");
            sessionStorage.removeItem("user_session");
            return false;
        }
        return true;
    }
    return false;
};

export const getCurrentUser = () => {
    const user = localStorage.getItem("user");
    const sessionActive = sessionStorage.getItem("user_session");
    
    if (user && sessionActive === "active") {
        const userData = JSON.parse(user);
        
        // Check if we need to update hotel name to Marathi version
        const nameVersion = localStorage.getItem("hotel_name_version");
        if (nameVersion !== "marathi_v1") {
            // Force logout to refresh with new Marathi names
            localStorage.removeItem("user");
            localStorage.removeItem("hotel_name_version");
            sessionStorage.removeItem("user_session");
            return null;
        }
        
        return userData;
    }
    return null;
};

export const getCurrentHotelId = () => {
    const user = getCurrentUser();
    console.log("🏨 getCurrentHotelId() Debug:");
    console.log("- Current user:", user);
    console.log("- HotelId:", user ? user.hotelId : "null");
    return user ? user.hotelId : null;
};