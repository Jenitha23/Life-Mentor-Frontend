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
                // API returns flat data: { token, userId, email, name }
                const userObj = {
                    userId: result.data.userId,
                    email: result.data.email,
                    name: result.data.name
                };
                setUser(userObj);
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
                // API returns flat data: { token, userId, email, name }
                const userObj = {
                    userId: result.data.userId,
                    email: result.data.email,
                    name: result.data.name
                };
                setUser(userObj);
                return { success: true, data: result.data };
            }
            return { success: false, message: result.message };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = async () => {
        await authService.logout();
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
            // Reset-password does not return a new session token; just report success
            return { success: result.success, message: result.message };
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