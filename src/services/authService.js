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
        return true;
    }
    return false;
};

export const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("hotel_name_version");
};

export const isAuthenticated = () => {
    const user = localStorage.getItem("user");
    if (user) {
        // Check if we need to update hotel name to Marathi version
        const nameVersion = localStorage.getItem("hotel_name_version");
        if (nameVersion !== "marathi_v1") {
            // Force logout to refresh with new Marathi names
            localStorage.removeItem("user");
            localStorage.removeItem("hotel_name_version");
            return false;
        }
        return true;
    }
    return false;
};

export const getCurrentUser = () => {
    const user = localStorage.getItem("user");
    if (user) {
        const userData = JSON.parse(user);
        
        // Check if we need to update hotel name to Marathi version
        const nameVersion = localStorage.getItem("hotel_name_version");
        if (nameVersion !== "marathi_v1") {
            // Force logout to refresh with new Marathi names
            localStorage.removeItem("user");
            localStorage.removeItem("hotel_name_version");
            return null;
        }
        
        return userData;
    }
    return null;
};

export const getCurrentHotelId = () => {
    const user = getCurrentUser();
    return user ? user.hotelId : null;
};