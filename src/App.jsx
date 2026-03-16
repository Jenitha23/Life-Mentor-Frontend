import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

// Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import CreateAssessment from './components/LifestyleAssessment/CreateAssessment';
import ViewAssessment from './components/LifestyleAssessment/ViewAssessment';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AIChatPage from './pages/AIChatPage';
import DailyCheckinPage from './pages/DailyCheckinPage';
import GoalsPage from './pages/GoalsPage';
import WellbeingPage from './pages/WellbeingPage';
import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';

// Private Route Component
const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Main Layout Component with Header & Footer
const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

// Auth Layout Component without Header/Footer
const AuthLayout = () => {
    return (
        <div className="min-h-screen">
            <Outlet />
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router
                basename={import.meta.env.BASE_URL}
                future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
            >
                <div className="App">
                    <Routes>
                        {/* All Routes with Header & Footer */}
                        <Route element={<MainLayout />}>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/features" element={<FeaturesPage />} />
                            <Route path="/pricing" element={<PricingPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/terms" element={<TermsPage />} />
                            <Route path="/privacy" element={<PrivacyPage />} />

                            {/* Protected Routes */}
                            <Route
                                path="/dashboard"
                                element={
                                    <PrivateRoute>
                                        <Dashboard />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/profile"
                                element={
                                    <PrivateRoute>
                                        <Profile />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/ai-chat"
                                element={
                                    <PrivateRoute>
                                        <AIChatPage />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/daily-checkin"
                                element={
                                    <PrivateRoute>
                                        <DailyCheckinPage />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/goals"
                                element={
                                    <PrivateRoute>
                                        <GoalsPage />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/wellbeing"
                                element={
                                    <PrivateRoute>
                                        <WellbeingPage />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/dashboard/assessment/create"
                                element={
                                    <PrivateRoute>
                                        <CreateAssessment />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/dashboard/assessment"
                                element={
                                    <PrivateRoute>
                                        <ViewAssessment />
                                    </PrivateRoute>
                                }
                            />
                        </Route>

                        {/* Auth Routes without Header/Footer */}
                        <Route element={<AuthLayout />}>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password" element={<ResetPassword />} />
                        </Route>

                        {/* Catch all route */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>

                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
