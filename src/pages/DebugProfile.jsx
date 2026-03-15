import React, { useEffect } from 'react';

const DebugProfile = ({ children }) => {
    useEffect(() => {
        console.log('🟢 DebugProfile: Component is mounting');
        console.log('🔵 Check CSS:', document.styleSheets.length, 'stylesheets loaded');

        // Check if Profile.css is loaded
        const styles = Array.from(document.styleSheets);
        const profileStyles = styles.find(sheet =>
            sheet.href && sheet.href.includes('Profile.css')
        );
        console.log('🔵 Profile.css loaded:', !!profileStyles);

        // Force check DOM after mount
        setTimeout(() => {
            const profileContainer = document.querySelector('.profile-container');
            console.log('🔵 Profile container found:', !!profileContainer);
            if (profileContainer) {
                console.log('🔵 Container styles:', window.getComputedStyle(profileContainer));
            }
        }, 100);

        return () => {
            console.log('🔴 DebugProfile: Component unmounting');
        };
    }, []);

    return (
        <div style={{
            border: '2px solid red',
            padding: '10px',
            margin: '10px',
            position: 'relative'
        }}>
            <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                background: 'red',
                color: 'white',
                padding: '5px',
                fontSize: '12px',
                zIndex: 9999
            }}>
                DEBUG MODE
            </div>
            {children}
        </div>
    );
};

export default DebugProfile;