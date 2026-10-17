import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from './providers';
import { AppRoutes } from './routes';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Sidebar } from '../components/layout/Sidebar';
import '../styles/variables.css';
import '../styles/global.css';
import '../styles/typography.css';
import '../styles/utilities.css';

export const App: React.FC = () => {
  return (
    <AppProviders>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-background)' }}>
          <Header />
          <main style={{ flex: 1 }}>
            <AppRoutes />
          </main>
          <Footer />
          <Sidebar />
        </div>
      </BrowserRouter>
    </AppProviders>
  );
};

export default App;
