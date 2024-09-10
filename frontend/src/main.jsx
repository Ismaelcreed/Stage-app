// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import './assets/css/index.css';
import App from './App';
import ApolloWrapper from './ApolloClient';
import './Composants/Animations/i18n';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <ApolloWrapper>
    <App />
  </ApolloWrapper>
);
