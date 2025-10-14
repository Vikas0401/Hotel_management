import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { validateHotelAccess, isAuthenticated } from '../services/multiHotelAuthService';

const HotelRoute = ({ children }) => {
    const navigate = useNavigate();
    const { hotelId } = useParams();

    useEffect(() => {
        // Check if user is authenticated
        if (!isAuthenticated()) {
            navigate('/login', { replace: true });
            return;
        }

        // Validate hotel access
        if (hotelId && !validateHotelAccess(hotelId, navigate)) {
            return; // validateHotelAccess handles the redirect
        }
    }, [hotelId, navigate]);

    // Don't render children if not authenticated or no access
    if (!isAuthenticated()) {
        return null;
    }

    if (hotelId && !validateHotelAccess(hotelId, () => {})) {
        return null;
    }

    return <>{children}</>;
};

export default HotelRoute;