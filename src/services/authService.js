// Legacy Auth Service - Re-exports from shared multi-hotel auth service
// This file maintains backward compatibility for existing imports

export { 
    login, 
    logout, 
    isAuthenticated, 
    getCurrentUser, 
    getCurrentHotelId,
    hasHotelAccess,
    validateHotelAccess,
    getHotelRoutePrefix
} from '../shared/services/multiHotelAuthService';