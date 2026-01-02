import React from 'react';
import { AppProvider, AppContext } from './contexts/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ReservationPage } from './pages/ReservationPage';
import { ContactPage } from './pages/ContactPage';
import { useAppContext } from './hooks/useAppContext';

interface PageProps {
  id: string;
}

const AppContent: React.FC = () => {
    return (
        <div className="bg-primary-light overflow-x-hidden text-text-dark transition-colors duration-500">
            <Header />
            <main>
                <HomePage id="home" />
                <MenuPage id="menu" />
                <ReviewsPage id="reviews" />
                <ReservationPage id="reservation" />
                <ContactPage id="contact" />
            </main>
            <Footer />
        </div>
    );
}

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;