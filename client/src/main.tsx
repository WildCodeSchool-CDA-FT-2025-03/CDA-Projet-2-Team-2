import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ApolloProvider } from '@apollo/client';

import App from './App.tsx';
import client from './services/apolloClient.ts';

import './index.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

createRoot(root).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
);
