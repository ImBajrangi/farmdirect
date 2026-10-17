import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TranslationProvider } from '../hooks/useTranslation';
import { AuthProvider } from '../features/auth/AuthContext';
import { CartProvider } from '../features/cart/cart.context';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min cache for fast low-bandwidth mobile responses
      gcTime: 1000 * 60 * 30,
      retry: 1,
    },
  },
});

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TranslationProvider>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </TranslationProvider>
    </QueryClientProvider>
  );
};
