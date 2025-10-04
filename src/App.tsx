import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import LoginPage from './components/LoginPage';
import Layout from './components/Layout';
import ClientsPage from './components/ClientsPage';
import CategoriesPage from './components/CategoriesPage';
import ProductsPage from './components/ProductsPage';
import ReposPage from './components/ReposPage';
import AuctionsPage from './components/AuctionsPage';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('clients');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'clients':
        return <ClientsPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'products':
        return <ProductsPage />;
      case 'repos':
        return <ReposPage />;
      case 'auctions':
        return <AuctionsPage />;
      default:
        return <ClientsPage />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
};

export default App;