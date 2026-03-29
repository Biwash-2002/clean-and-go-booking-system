import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Box } from '@mantine/core';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box style={{ flex: 1 }}>
                {children}
            </Box>
            <Footer />
        </Box>
    );
};

export default Layout;
