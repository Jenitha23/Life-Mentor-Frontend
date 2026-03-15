import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on initial load
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const result = await authService.login({ email, password });
            if (result.success) {
                setUser(result.data.user);
                return { success: true, data: result.data };
            }
            return { success: false, message: result.message };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const register = async (userData) => {
        try {
            const result = await authService.register(userData);
            if (result.success) {
                setUser(result.data.user);
                return { success: true, data: result.data };
            }
            return { success: false, message: result.message };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const forgotPassword = async (email) => {
        try {
            const result = await authService.forgotPassword(email);
            return { success: result.success, message: result.message };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const resetPassword = async (token, newPassword, confirmPassword) => {
        try {
            const result = await authService.resetPassword(token, newPassword, confirmPassword);
            if (result.success) {
                setUser(result.data.user);
                return { success: true, data: result.data };
            }
            return { success: false, message: result.message };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };
    const updateUser = (updatedUserData) => {
        setUser(updatedUserData);
        localStorage.setItem('user', JSON.stringify(updatedUserData));
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateUser,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};