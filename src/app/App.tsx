import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppProviders } from './providers';
import { AppRoutes } from './routes';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { SoftwareStatusBar } from '../components/layout/SoftwareStatusBar';
import { Sidebar } from '../components/layout/Sidebar';
import '../styles/variables.css';
import '../styles/global.css';
import '../styles/typography.css';
import '../styles/utilities.css';

const AppLayout: React.FC = () => {
  const location = useLocation();

  const isMarketingPage =
    location.pathname === '/' ||
    location.pathname === '/about' ||
    location.pathname === '/terms' ||
    location.pathname === '/privacy' ||
    location.pathname === '/cancellation-refund' ||
    location.pathname === '/support' ||
    location.pathname === '/home';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-background, #FFFFFF)' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <AppRoutes />
      </main>
      {isMarketingPage ? <Footer /> : <SoftwareStatusBar />}
      <Sidebar />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProviders>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AppProviders>
  );
};

export default App;
