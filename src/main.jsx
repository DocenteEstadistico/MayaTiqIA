import React from 'react';
import ReactDOM from 'react-dom/client';
import MayanDashboard from '../MayanDashboard';
import AccessGate from './components/AccessGate';
import '../mayan-theme.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AccessGate>
      <MayanDashboard />
    </AccessGate>
  </React.StrictMode>
);
