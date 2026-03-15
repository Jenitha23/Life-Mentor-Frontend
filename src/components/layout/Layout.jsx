import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import './Layout.css';

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <Header />
            <main className="layout-main">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;