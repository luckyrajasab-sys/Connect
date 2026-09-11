import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ContactProvider, useContacts } from './context/ContactContext';
import { I18nProvider } from './context/I18nContext';
import { NetworkCanvas } from './components/NetworkCanvas/NetworkCanvas';
import { Navbar } from './components/Navbar/Navbar';
import { MobileDrawer } from './components/MobileDrawer/MobileDrawer';
import { BottomNavigation } from './components/BottomNavigation/BottomNavigation';
import { FloatingDialer } from './components/FloatingDialer/FloatingDialer';
import { ToastNotification } from './components/Toast/Toast';

// Global Modals
import { PopCard } from './components/PopCard/PopCard';
import { EmailComposer } from './components/EmailComposer/EmailComposer';
import { QRModal } from './components/QRModal/QRModal';
import { ShareModal } from './components/ShareModal/ShareModal';
import { DuplicateManager } from './components/DuplicateManager/DuplicateManager';

import { AuthRequiredModal } from './components/AuthRequiredModal/AuthRequiredModal';

// Pages
import { Home } from './pages/Home/Home';
import { Contacts } from './pages/Contacts/Contacts';
import { ContactDetails } from './pages/ContactDetails/ContactDetails';
import { AddContact } from './pages/AddContact/AddContact';
import { EditContact } from './pages/EditContact/EditContact';
import { Favorites } from './pages/Favorites/Favorites';
import { Groups } from './pages/Groups/Groups';
import { MapPage } from './pages/Map/MapPage';
import { Analytics } from './pages/Analytics/Analytics';
import { Emergency } from './pages/Emergency/Emergency';
import { QRHub } from './pages/QRHub/QRHub';
import { Profile } from './pages/Profile/Profile';
import { Auth } from './pages/Auth/Auth';

import './App.css';

const AppContent = () => {
  const { isAuthLoading, loadingMessage } = useContacts();

  if (isAuthLoading) {
    return (
      <div className="auth-loading-viewport">
        <div className="app-brand-loader">
          <div className="brand-loader-logo">C</div>
          <div className="brand-loader-spinner"></div>
          <p>{loadingMessage || 'Loading Connect...'}</p>
        </div>
      </div>
    );
  }

  // Application Shell (Supports Guest View-Only Mode & Authenticated Member Mode)
  return (
    <div className="app-layout">
      {/* Soft Particle Network Background Canvas */}
      <NetworkCanvas />

      {/* Top Application Header */}
      <Navbar />

      <div className="app-body-container">
        {/* Main Content Viewport */}
        <main className="app-main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/contacts/:id" element={<ContactDetails />} />
            <Route path="/add" element={<AddContact />} />
            <Route path="/edit/:id" element={<EditContact />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/qr" element={<QRHub />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Slide-out Mobile Navigation Drawer */}
      <MobileDrawer />

      {/* Quick Phone Dialer */}
      <FloatingDialer />

      {/* Responsive Mobile Navigation */}
      <BottomNavigation />

      {/* Global Interactive Modals */}
      <PopCard />
      <EmailComposer />
      <QRModal />
      <ShareModal />
      <DuplicateManager />
      <AuthRequiredModal />

      {/* Toast Notification Container */}
      <ToastNotification />
    </div>
  );
};

export const App = () => {
  return (
    <I18nProvider>
      <ContactProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ContactProvider>
    </I18nProvider>
  );
};

export default App;
