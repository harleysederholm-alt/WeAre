'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'STAFF' | 'MANAGER' | 'ADMIN';

interface User {
    email: string;
    role: Role;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, role: Role) => void;
    logout: () => void;
    activeRestaurant: { id: string; name: string } | null;
    availableRestaurants: { id: string; name: string }[];
    switchRestaurant: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [activeRestaurant, setActiveRestaurant] = useState<{ id: string; name: string } | null>(null);

    // Mock restaurants for now - normally this would come from an API based on the user
    const availableRestaurants = [
        { id: 'restaurant-1', name: 'Helsinki' },
        { id: 'restaurant-2', name: 'Tampere' },
        { id: 'restaurant-3', name: 'Turku' },
    ];

    // Load from local storage on mount
    useEffect(() => {
        const stored = localStorage.getItem('weare_user');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse stored user", e);
            }
        }

        // Initialize active restaurant
        const storedRestaurant = localStorage.getItem('weare_active_restaurant');
        if (storedRestaurant) {
            try {
                setActiveRestaurant(JSON.parse(storedRestaurant));
            } catch (e) {
                setActiveRestaurant(availableRestaurants[0]);
            }
        } else {
            setActiveRestaurant(availableRestaurants[0]);
        }
    }, []);

    const login = (email: string, role: Role) => {
        const newUser = { email, role };
        setUser(newUser);
        localStorage.setItem('weare_user', JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('weare_user');
        localStorage.removeItem('weare_active_restaurant');
    };

    const switchRestaurant = (id: string) => {
        const restaurant = availableRestaurants.find(r => r.id === id);
        if (restaurant) {
            setActiveRestaurant(restaurant);
            localStorage.setItem('weare_active_restaurant', JSON.stringify(restaurant));
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            activeRestaurant,
            availableRestaurants,
            switchRestaurant
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
