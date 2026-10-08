import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminDashboard from './components/AdminDashboard';
import './index.css';

function AdminApp() {
  return (
    <div className="app admin-app-page">
      <AdminDashboard onBackToHome={() => { window.location.href = './index.html'; }} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);
