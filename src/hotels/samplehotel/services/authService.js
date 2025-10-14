// Sample Hotel Authentication Service
// This service imports from the shared multi-hotel auth service
import { 
    login as sharedLogin, 
    logout as sharedLogout, 
    isAuthenticated as sharedIsAuthenticated, 
    getCurrentUser as sharedGetCurrentUser, 
    getCurrentHotelId as sharedGetCurrentHotelId
} from '../../../shared/services/multiHotelAuthService';

// Re-export shared functions with hotel-specific validation
export const login = (username, password) => {
    const result = sharedLogin(username, password);
    if (result) {
        const user = sharedGetCurrentUser();
        // Ensure only samplehotel users can login through this service
        if (user && user.hotelId === 'samplehotel') {
            return true;
        } else {
            sharedLogout();
            return false;
        }
    }
    return false;
};

export const logout = sharedLogout;

export const isAuthenticated = () => {
    const isAuth = sharedIsAuthenticated();
    if (isAuth) {
        const user = sharedGetCurrentUser();
        // Only return true if user belongs to samplehotel
        return user && user.hotelId === 'samplehotel';
    }
    return false;
};

export const getCurrentUser = () => {
    const user = sharedGetCurrentUser();
    // Only return user if they belong to samplehotel
    if (user && user.hotelId === 'samplehotel') {
        return user;
    }
    return null;
};

export const getCurrentHotelId = () => {
    const hotelId = sharedGetCurrentHotelId();
    // Only return hotel ID if it's samplehotel
    return hotelId === 'samplehotel' ? hotelId : null;
};