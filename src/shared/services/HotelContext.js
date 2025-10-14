import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, getCurrentHotelId } from './multiHotelAuthService';

const HotelContext = createContext();

export const useHotel = () => {
    const context = useContext(HotelContext);
    if (!context) {
        throw new Error('useHotel must be used within a HotelProvider');
    }
    return context;
};

export const HotelProvider = ({ children }) => {
    const [currentHotel, setCurrentHotel] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const updateHotelContext = () => {
            const user = getCurrentUser();
            const hotelId = getCurrentHotelId();
            
            setCurrentHotel(user ? {
                id: hotelId,
                name: user.hotelName,
                theme: user.theme,
                language: user.language,
                address: user.address,
                isAdmin: user.isAdmin
            } : null);
            setIsLoading(false);
        };

        updateHotelContext();
        
        // Listen for storage changes (login/logout events)
        const handleStorageChange = () => {
            updateHotelContext();
        };
        
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const value = {
        currentHotel,
        isLoading,
        refreshHotel: () => {
            const user = getCurrentUser();
            const hotelId = getCurrentHotelId();
            setCurrentHotel(user ? {
                id: hotelId,
                name: user.hotelName,
                theme: user.theme,
                language: user.language,
                address: user.address,
                isAdmin: user.isAdmin
            } : null);
        }
    };

    return (
        <HotelContext.Provider value={value}>
            {children}
        </HotelContext.Provider>
    );
};
