
import React, { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <main className="container pt-24 pb-16 px-4 md:px-6 animate-page-transition">
        {children}
      </main>
    </div>
  );
};

export default Layout;
