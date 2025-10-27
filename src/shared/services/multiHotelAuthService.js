// Multi-Hotel Authentication Service
// This service manages authentication for multiple hotels with unique credentials

const hotelCredentials = {
    "matoshree": {
        username: "matoshree_admin",
        password: "matoshree@2025",
        hotelName: "हॉटेल मातोश्री",
        hotelId: "matoshree",
        isAdmin: true,
        address: "वांबोरी, राहुरी, जिल्हा - अहिल्यानगर, महाराष्ट्र - ४१३७०४",
        theme: "matoshree",
        language: "marathi"
    },
    "jagdamba": {
        username: "jagdamba_hotel_admin",
        password: "jagdamba#2025!secure",
        hotelName: "हॉटेल जगदंबा",
        hotelId: "jagdamba",
        isAdmin: true,
        address: "वांबोरी, राहुरी, जिल्हा - अहिल्यानगर, महाराष्ट्र - ४१३७०४",
        theme: "jagdamba",
        language: "marathi"
    },
    "shreehari": {
        username: "shreehari_admin",
        password: "shreehari@2025#secure",
        hotelName: "हॉटेल श्री हरी",
        hotelId: "shreehari",
        isAdmin: true,
        address: "वांबोरी, राहुरी, जिल्हा - अहिल्यानगर, महाराष्ट्र - ४१३७०४",
        theme: "shreehari",
        language: "marathi"
    },
    "samplehotel": {
        username: "sample_demo_user",
        password: "sample$demo%2025",
        hotelName: "Sample Demo Hotel",
        hotelId: "samplehotel", 
        isAdmin: true,
        address: "Demo Location, Sample City, India",
        theme: "sample",
        language: "english"
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
            theme: hotel.theme,
            language: hotel.language,
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
    
    // Clear the navigation history
    if (window.history.replaceState) {
        window.history.replaceState(null, null, '/login');
    }
};

export const isAuthenticated = () => {
    const user = localStorage.getItem("user");
    const sessionActive = sessionStorage.getItem("user_session");
    
    if (user && sessionActive === "active") {
        const nameVersion = localStorage.getItem("hotel_name_version");
        if (nameVersion !== "marathi_v1") {
            logout();
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
        
        const nameVersion = localStorage.getItem("hotel_name_version");
        if (nameVersion !== "marathi_v1") {
            logout();
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

// Route Protection: Check if user has access to specific hotel routes
export const hasHotelAccess = (requestedHotelId) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    
    // Users can only access their own hotel's routes
    return currentUser.hotelId === requestedHotelId;
};

// Get hotel-specific route prefix
export const getHotelRoutePrefix = () => {
    const user = getCurrentUser();
    return user ? `/hotels/${user.hotelId}` : '/';
};

// Validate hotel access and redirect if necessary
export const validateHotelAccess = (requestedHotelId, navigate) => {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        navigate('/login', { replace: true });
        return false;
    }
    
    if (currentUser.hotelId !== requestedHotelId) {
        // Redirect to their own hotel dashboard
        navigate(`/hotels/${currentUser.hotelId}/home`, { replace: true });
        return false;
    }
    
    return true;
};
